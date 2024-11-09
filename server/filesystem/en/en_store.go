package en

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
)

type KeyStore struct{}

// SaveSymmetricKey saves a symmetric encryption key to the specified folder
func (ks *KeyStore) SaveSymEn(folderPath, fileName, keyContent string) error {
	// Ensure the 'keys/symmetric/algorithmUsed' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys/symmetric")
	if err := os.MkdirAll(keysDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create keys/symmetric/%s directory: ", err)
	}

	// Create the full path for the key file (with .key extension)
	keyFilePath := filepath.Join(keysDir, fileName+".key")

	// Write the key content to the file
	if err := os.WriteFile(keyFilePath, []byte(keyContent), 0644); err != nil {
		return fmt.Errorf("failed to write key to file: %v", err)
	}

	return nil
}

type HybridRequestData struct {
	FileName string
	MsgArmor string
}

func (ks *KeyStore) SaveHybEn(req HybridRequestData) error {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()

	if folderPath == "" {
		return fmt.Errorf("Please initialize the folder where you want to store data")
	}

	messageDir := filepath.Join(folderPath, "keys/asymmetric")
	if err := os.MkdirAll(messageDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create message directory: %v", err)
	}

	messageFilePath := filepath.Join(messageDir, req.FileName+".asc")

	if err := os.WriteFile(messageFilePath, []byte(req.MsgArmor), 0644); err != nil {
		return fmt.Errorf("failed to write PGP message to file: %v", err)
	}

	fmt.Printf("PGP message saved successfully in %s\n", messageFilePath)
	return nil
}
