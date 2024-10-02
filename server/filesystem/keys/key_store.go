package keys

import (
	"fmt"
	"os"
	"path/filepath"
)

type KeyStore struct{}

// SaveSymmetricKey saves a symmetric encryption key to the specified folder
func (ks *KeyStore) SaveSymmetricKey(folderPath, fileName, keyContent string) error {
	// Ensure the 'keys/symmetric' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys/symmetric")
	if err := os.MkdirAll(keysDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create keys/symmetric directory: %v", err)
	}

	// Create the full path for the key file (with .key extension)
	keyFilePath := filepath.Join(keysDir, fileName+".key")

	// Write the key content to the file
	if err := os.WriteFile(keyFilePath, []byte(keyContent), 0644); err != nil {
		return fmt.Errorf("failed to write key to file: %v", err)
	}

	return nil
}

// SaveAsymmetricKey saves a symmetric encryption key to the specified folder
func (ks *KeyStore) SaveAsymmetricKey(folderPath, fileName, keyContent string) error {
	// Ensure the 'keys/symmetric' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys/asymmetric")
	if err := os.MkdirAll(keysDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create keys/asymmetric directory: %v", err)
	}

	// Create the full path for the key file (with .key extension)
	keyFilePath := filepath.Join(keysDir, fileName+".key")

	// Write the key content to the file
	if err := os.WriteFile(keyFilePath, []byte(keyContent), 0644); err != nil {
		return fmt.Errorf("failed to write key to file: %v", err)
	}

	return nil
}
