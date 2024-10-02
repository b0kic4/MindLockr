package filesystem

import (
	"fmt"
	"os"
	"path/filepath"
)

type KeyStore struct{}

// SaveKey saves a generated encryption key to the specified folder
func (ks *KeyStore) SaveKey(folderPath, fileName, keyContent string) error {
	// Ensure the 'keys' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys")
	if err := os.MkdirAll(keysDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	// Create the full path for the key file (with .key extension)
	keyFilePath := filepath.Join(keysDir, fileName+".key")

	// Write the key content to the file
	if err := os.WriteFile(keyFilePath, []byte(keyContent), 0644); err != nil {
		return fmt.Errorf("failed to write key to file: %v", err)
	}

	return nil
}

// add edit in here
