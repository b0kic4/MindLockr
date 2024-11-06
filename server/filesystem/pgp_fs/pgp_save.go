package pgpfs

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
)

func SavePgpPrivKey(privKeyArmor string, keyName string, enType string) error {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()

	if folderPath == "" {
		return fmt.Errorf("Please initialize the folder where you want to store private key")
	}

	// Include the encryption type in the path
	keysDir := filepath.Join(folderPath, "pgp", enType, keyName)

	err := os.MkdirAll(keysDir, 0700) // Set directory permissions to 0700
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "private.asc") // Use .asc extension

	err = os.WriteFile(keyFilePath, []byte(privKeyArmor), 0600) // Use 0600 permissions
	if err != nil {
		return fmt.Errorf("failed to write private key to file: %v", err)
	}

	return nil
}

func SavePgpPublicKey(pubKeyArmor string, keyName string, enType string) error {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()

	if folderPath == "" {
		return fmt.Errorf("Please initialize the folder where you want to store public key")
	}

	// Include the encryption type in the path
	keysDir := filepath.Join(folderPath, "pgp", enType, keyName)

	err := os.MkdirAll(keysDir, 0755) // Set directory permissions to 0755
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "public.asc") // Use .asc extension

	err = os.WriteFile(keyFilePath, []byte(pubKeyArmor), 0644) // Use 0644 permissions
	if err != nil {
		return fmt.Errorf("failed to write public key to file: %v", err)
	}

	return nil
}
