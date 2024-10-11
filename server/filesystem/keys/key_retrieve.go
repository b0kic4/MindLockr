package keys

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
)

type KeyRetrieve struct {
	folderInstance *filesystem.Folder
}

func NewKeyRetrieve(folder *filesystem.Folder) *KeyRetrieve {
	return &KeyRetrieve{
		folderInstance: folder,
	}
}

type KeyInfo struct {
	Name      string `json:"name"`
	Algorithm string `json:"algorithm"`
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

type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Path string `json:"path"`
}

type FolderInfo struct {
	Name  string     `json:"name"`
	Files []FileInfo `json:"files"`
	Path  string     `json:"path"`
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

	for _, folderDir := range folderDirs {
		if !folderDir.IsDir() {
			continue
		}

		folderName := folderDir.Name()
		mainFolderPath := filepath.Join(keysBaseFolderPath, folderName)
		files := []FileInfo{}

		algoDirs, err := os.ReadDir(mainFolderPath)
		if err != nil {
			return nil, fmt.Errorf("Error reading algorithm folders in %s: %v", folderName, err)
		}

		for _, algoDir := range algoDirs {
			if !algoDir.IsDir() {
				continue
			}

			algoName := algoDir.Name()
			algoFolderPath := filepath.Join(mainFolderPath, algoName)
			algoFiles, err := os.ReadDir(algoFolderPath)
			if err != nil {
				return nil, fmt.Errorf("Error reading files in algorithm folder %s: %v", algoName, err)
			}

			for _, file := range algoFiles {
				files = append(files, FileInfo{
					Name: fmt.Sprintf("%s/%s", algoName, file.Name()),
					Type: "Encrypted Data",
					Path: filepath.Join(algoFolderPath, file.Name()),
				})
			}
		}

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

		folders = append(folders, FolderInfo{
			Name:  folderName,
			Files: files,
			Path:  mainFolderPath,
		})
	}

	return folders, nil
}
