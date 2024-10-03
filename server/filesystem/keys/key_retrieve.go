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

// RetrieveSymmetricKeys retrieves the symmetric key files from the folderPath/keys/symmetric and returns them as a slice of KeyInfo
func (kr *KeyRetrieve) RetrieveSymmetricKeys() ([]KeyInfo, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	fmt.Println("folderPath: ", folderPath)

	// Define the keys subdirectory
	keysBaseFolderPath := filepath.Join(folderPath, "keys/symmetric")

	fmt.Println("Keys Base Folder Path:", keysBaseFolderPath)

	// Check if the base keys folder exists
	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist.")
	}

	// Create a slice to store key file info
	var keyFiles []KeyInfo
	// Iterate through subdirectories (e.g., AES-128, AES-256, etc.)

	subdirs, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	for _, subdir := range subdirs {
		if subdir.IsDir() {
			algorithm := subdir.Name()

			algoDirPath := filepath.Join(keysBaseFolderPath, algorithm)
			files, err := os.ReadDir(algoDirPath)
			if err != nil {
				return nil, fmt.Errorf("Error reading algorithm directory %s: %v", algorithm, err)
			}

			// Iterate over files and add them to the keyFiles slice
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

	fmt.Println(keyFiles)

	// Return the list of key file info
	return keyFiles, nil
}

// RetrieveAsymmetricKeys retrieves the asymmetric key files from the folderPath/keys/asymmetric and returns them as a slice of KeyInfo
func (kr *KeyRetrieve) RetrieveAsymmetricKeys() ([]KeyInfo, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	// Define the keys subdirectory
	keysBaseFolderPath := filepath.Join(folderPath, "keys/asymmetric")

	// Check if the base keys folder exists
	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist.")
	}

	// Create a slice to store key file info
	var keyFiles []KeyInfo

	// Iterate through subdirectories (e.g., RSA-2048, RSA-4096, etc.)
	subdirs, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	for _, subdir := range subdirs {
		if subdir.IsDir() {
			algorithm := subdir.Name() // Algorithm is the name of the subdirectory (e.g., RSA-2048)

			// Read files within the algorithm subdirectory
			algoDirPath := filepath.Join(keysBaseFolderPath, algorithm)
			files, err := os.ReadDir(algoDirPath)
			if err != nil {
				return nil, fmt.Errorf("Error reading algorithm directory %s: %v", algorithm, err)
			}

			// Iterate over files and add them to the keyFiles slice
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

	// Return the list of key file info
	return keyFiles, nil
}
