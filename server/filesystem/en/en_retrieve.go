package en

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
)

type EnRetrieve struct {
	folderInstance *filesystem.Folder
}

func NewEnRetrieve(folder *filesystem.Folder) *EnRetrieve {
	return &EnRetrieve{
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

func (kr *EnRetrieve) LoadEncryptedContent(keyName string) (string, error) {
	folderPath := kr.folderInstance.GetFolderPath()
	keyFilePath := filepath.Join(folderPath, "keys", "symmetric", keyName)

	content, err := os.ReadFile(keyFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to read key file: %v", err)
	}

	return string(content), nil
}

func (kr *EnRetrieve) LoadAsymEnData(dataFilePath string) (string, error) {
	dataPath := filepath.Join(dataFilePath)

	content, err := os.ReadFile(dataPath)
	if err != nil {
		return "", fmt.Errorf("Error ocurred when reading content from file path: %v", err)
	}

	return string(content), nil
}

func (kr *EnRetrieve) RetrieveSymEn() ([]KeyInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()

	keysBaseFolderPath := filepath.Join(folderPath, "keys/symmetric")

	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist at: %s", keysBaseFolderPath)
	}

	var keyFiles []KeyInfo

	files, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	for _, file := range files {
		if !file.IsDir() && file.Name() != ".DS_Store" {
			keyFiles = append(keyFiles, KeyInfo{
				Name:      file.Name(),
				Algorithm: "AES-256",
			})
		}
	}

	return keyFiles, nil
}

func (kr *EnRetrieve) RetrieveAsymEn() ([]FolderInfo, error) {
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
