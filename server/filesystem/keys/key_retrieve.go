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

func (kr *KeyRetrieve) RetrieveAsymmetricKeys() ([]KeyInfo, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	// Define the keys subdirectory
	keysBaseFolderPath := filepath.Join(folderPath, "keys/asymmetric")

	// Check if the base keys folder exists
	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		// Return an empty slice instead of nil when no folder exists
		return []KeyInfo{}, nil
	}

	// Create a slice to store key file info
	var keyFiles []KeyInfo

	// Iterate through subdirectories (e.g., RSA-2048, RSA-4096, etc.)
	subdirs, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	// Traverse through each subdirectory (which represents an algorithm)
	for _, subdir := range subdirs {
		if subdir.IsDir() {
			algorithm := subdir.Name()

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
