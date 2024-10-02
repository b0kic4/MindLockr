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

// RetrieveKeys retrieves the key files from the folderPath/keys and returns them as a slice of strings
func (kr *KeyRetrieve) RetrieveSymmetricKeys() ([]string, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	// Define the keys subdirectory
	keysFolderPath := filepath.Join(folderPath, "keys/symmetric")

	// Check if the keys folder exists
	if _, err := os.Stat(keysFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist.")
	}

	// Read all files in the keys folder
	files, err := os.ReadDir(keysFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	// Create a slice to store the names of key files
	var keyFiles []string
	for _, file := range files {
		if !file.IsDir() {
			keyFiles = append(keyFiles, file.Name())
		}
	}

	// Return the list of key file names
	return keyFiles, nil
}

// RetrieveKeys retrieves the key files from the folderPath/keys and returns them as a slice of strings
func (kr *KeyRetrieve) RetrieveAsymmetricKeys() ([]string, error) {
	// Get the folder path from the instance
	folderPath := kr.folderInstance.GetFolderPath()

	// Define the keys subdirectory
	keysFolderPath := filepath.Join(folderPath, "keys/asymmetric")

	// Check if the keys folder exists
	if _, err := os.Stat(keysFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist.")
	}

	// Read all files in the keys folder
	files, err := os.ReadDir(keysFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	// Create a slice to store the names of key files
	var keyFiles []string
	for _, file := range files {
		if !file.IsDir() {
			keyFiles = append(keyFiles, file.Name())
		}
	}

	// Return the list of key file names
	return keyFiles, nil
}
