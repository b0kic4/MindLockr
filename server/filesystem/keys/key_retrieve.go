package keys

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type KeyRetrieve struct {
	folderInstance *filesystem.Folder
}

func NewKeyRetrieve(folder *filesystem.Folder) *KeyRetrieve {
	return &KeyRetrieve{
		folderInstance: folder,
	}
}

type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Path string `json:"path"`
}

type FolderInfo struct {
	Name  string     `json:"name"`
	Path  string     `json:"path"`
	Type  string     `json:"type"`
	Files []FileInfo `json:"files"`
}

type KeyInfo struct {
	Name      string `json:"name"`
	Algorithm string `json:"algorithm"`
}

type PgpKeyInfo struct {
	Name       string `json:"name"`
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
	FolderPath string `json:"folderPath"`
	Type       string `json:"type"`
}

func (kr *KeyRetrieve) LoadEncryptedKeyContent(keyName string, algorithmType string) (string, error) {
	folderPath := kr.folderInstance.GetFolderPath()
	keyFilePath := filepath.Join(folderPath, "keys", "symmetric", algorithmType, keyName)

	content, err := os.ReadFile(keyFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to read key file: %v", err)
	}

	return string(content), nil
}

func (kr *KeyRetrieve) LoadAsymmetricEnData(dataFilePath string) (string, error) {
	dataPath := filepath.Join(dataFilePath)

	content, err := os.ReadFile(dataPath)
	if err != nil {
		return "", fmt.Errorf("Error ocurred when reading content from file path: %v", err)
	}

	return string(content), nil
}

func (kr *KeyRetrieve) GetEncryptionFromSignature(sigPath string) (string, error) {
	// Get the directory containing the signature.sig
	signatureDir := filepath.Dir(sigPath)

	// Go one directory up (the parent directory, which contains the AES-* folder)
	parentDir := filepath.Dir(signatureDir)

	folderName := filepath.Base(signatureDir)

	// Walk the parent directory to find AES-* folder
	var aesFolder string
	err := filepath.Walk(parentDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Check if the folder name matches AES-128, AES-192, or AES-256
		if info.IsDir() && (strings.Contains(info.Name(), "AES-128") ||
			strings.Contains(info.Name(), "AES-192") ||
			strings.Contains(info.Name(), "AES-256")) {
			aesFolder = info.Name()
			return filepath.SkipDir
		}
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("error walking file tree: %v", err)
	}

	if aesFolder == "" {
		return "", fmt.Errorf("AES folder not found in: %s", parentDir)
	}

	newPath := filepath.Join(parentDir, folderName, aesFolder, "symmetric_data.enc")

	dataContent, err := kr.LoadAsymmetricEnData(newPath)
	if err != nil {
		return newPath, fmt.Errorf("failed to load en data content. path is returned: %s", err)
	}

	return dataContent, nil
}

func (kr *KeyRetrieve) RetrieveSymmetricKeys() ([]KeyInfo, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	// Define the keys subdirectory
	keysBaseFolderPath := filepath.Join(folderPath, "keys/symmetric")

	// Check if the base keys folder exists
	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist at: %s", err)
	}

	// Create a slice to store key file info
	var keyFiles []KeyInfo

	// Iterate through subdirectories (e.g., AES-128, AES-192, etc.)
	subdirs, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	// Traverse through each subdirectory (which represents an algorithm)
	for _, subdir := range subdirs {
		if subdir.IsDir() {
			algorithm := subdir.Name() // Use the folder name as the algorithm (e.g., AES-128)

			// Path to the directory that contains the actual key files
			algoDirPath := filepath.Join(keysBaseFolderPath, algorithm)

			// Read all files in the algorithm directory
			files, err := os.ReadDir(algoDirPath)
			if err != nil {
				return nil, fmt.Errorf("Error reading algorithm directory %s: %v", algorithm, err)
			}

			// Iterate over each file in the directory
			for _, file := range files {
				if !file.IsDir() {
					keyFiles = append(keyFiles, KeyInfo{
						Name:      file.Name(),
						Algorithm: algorithm,
					})
				}
			}
		}
	}

	return keyFiles, nil
}

func (kr *KeyRetrieve) RetrievePgpKeys() ([]PgpKeyInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()

	eccBaseFolderPath := filepath.Join(folderPath, "pgp", "ECC")
	rsaBaseFolderPath := filepath.Join(folderPath, "pgp", "RSA")

	eccKeys := []PgpKeyInfo{}
	rsaKeys := []PgpKeyInfo{}
	var err error

	// Pass the key type "ECC" when retrieving ECC keys
	eccKeys, err = kr.getPgpKeysFromDirectory(eccBaseFolderPath, "ECC")
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error retrieving ECC PGP keys: %v", err)
	}

	// Pass the key type "RSA" when retrieving RSA keys
	rsaKeys, err = kr.getPgpKeysFromDirectory(rsaBaseFolderPath, "RSA")
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error retrieving RSA PGP keys: %v", err)
	}

	return append(eccKeys, rsaKeys...), nil
}

func (kr *KeyRetrieve) getPgpKeysFromDirectory(basePath string, keyType string) ([]PgpKeyInfo, error) {
	pgpKeys := []PgpKeyInfo{}

	if _, err := os.Stat(basePath); os.IsNotExist(err) {
		return pgpKeys, nil
	}

	keyFolders, err := os.ReadDir(basePath)
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error reading PGP keys folder: %v", err)
	}

	for _, keyFolder := range keyFolders {
		if keyFolder.IsDir() {
			keyName := keyFolder.Name()
			keyFolderPath := filepath.Join(basePath, keyName)

			pgpKeys = append(pgpKeys, PgpKeyInfo{
				Name:       keyName,
				FolderPath: keyFolderPath,
				Type:       keyType, // Add the type (ECC or RSA)
			})
		}
	}

	return pgpKeys, nil
}

func (kr *KeyRetrieve) RetrievePgpPubKey(keyFolderPath string) (string, error) {
	pubKeyPath := filepath.Join(keyFolderPath, "public.pem")

	pubKeyPEM, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read public key file: %v", err)
	}

	return string(pubKeyPEM), nil
}

func (kr *KeyRetrieve) RetrievePgpPrivKey(keyFolderPath string) (string, error) {
	privKeyPath := filepath.Join(keyFolderPath, "private.pem")

	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	return string(encryptedPrivKeyHex), nil
}

func (kr *KeyRetrieve) RetrieveAsymmetricKeys() ([]FolderInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()
	keysBaseFolderPath := filepath.Join(folderPath, "keys/asymmetric")

	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return []FolderInfo{}, nil
	}

	var folders []FolderInfo
	folderDirs, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	// Iterate over key-type directories (e.g., "ECC", "RSA")
	for _, folderDir := range folderDirs {
		if !folderDir.IsDir() {
			continue
		}

		// Retrieve key type folder (ECC, RSA)
		keyType := folderDir.Name() // "ECC" or "RSA"
		keyTypeFolderPath := filepath.Join(keysBaseFolderPath, keyType)

		// Iterate over key instances within the key type folder
		instanceDirs, err := os.ReadDir(keyTypeFolderPath)
		if err != nil {
			return nil, fmt.Errorf("Error reading key type folders in %s: %v", keyType, err)
		}

		for _, instanceDir := range instanceDirs {
			if !instanceDir.IsDir() {
				continue
			}

			folderName := instanceDir.Name() // Name of the key instance folder
			mainFolderPath := filepath.Join(keyTypeFolderPath, folderName)
			files := []FileInfo{}

			// Retrieve algorithm directories (e.g., AES-256) within the key instance folder
			algoDirs, err := os.ReadDir(mainFolderPath)
			if err != nil {
				return nil, fmt.Errorf("Error reading algorithm folders in %s: %v", folderName, err)
			}

			for _, algoDir := range algoDirs {
				if !algoDir.IsDir() {
					continue
				}

				algoName := algoDir.Name() // E.g., "AES-256"
				algoFolderPath := filepath.Join(mainFolderPath, algoName)
				algoFiles, err := os.ReadDir(algoFolderPath)
				if err != nil {
					return nil, fmt.Errorf("Error reading files in algorithm folder %s: %v", algoName, err)
				}

				// Collect files within the algorithm folder
				for _, file := range algoFiles {
					files = append(files, FileInfo{
						Name: fmt.Sprintf("%s/%s", algoName, file.Name()),
						Type: "Encrypted Data",
						Path: filepath.Join(algoFolderPath, file.Name()),
					})
				}
			}

			// Collect additional files like encrypted passphrase and signature from the key folder itself
			extraFiles := []string{"encrypted_passphrase.key", "signature.sig"}
			for _, file := range extraFiles {
				filePath := filepath.Join(mainFolderPath, file)
				if _, err := os.Stat(filePath); err == nil {
					fileType := "Key File"
					if file == "signature.sig" {
						fileType = "Signature File"
					}
					files = append(files, FileInfo{
						Name: file,
						Type: fileType,
						Path: filePath,
					})
				}
			}

			// Append the folder and associated files to the result list
			folders = append(folders, FolderInfo{
				Name:  folderName,
				Files: files,
				Path:  mainFolderPath,
				Type:  keyType, // Set key type (ECC or RSA) here
			})
		}
	}

	return folders, nil
}
