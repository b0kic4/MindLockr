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

	keysDir := filepath.Join(folderPath, "pgp", enType, keyName)

	err := os.MkdirAll(keysDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "private.asc")

	// Write the private key without specifying file permissions
	err = os.WriteFile(keyFilePath, []byte(privKeyArmor), 0644)
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

	keysDir := filepath.Join(folderPath, "pgp", enType, keyName)

	err := os.MkdirAll(keysDir, 0755)
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "public.asc")

	err = os.WriteFile(keyFilePath, []byte(pubKeyArmor), 0644)
	if err != nil {
		return fmt.Errorf("failed to write public key to file: %v", err)
	}

	return nil
}
