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
	SymmetricData       string
	AlgSymEnc           string
	EncyrptedPassphrase string
	Signature           string
	FolderName          string
	AsymAlgType         string
}

func (ks *KeyStore) SaveHybEn(req HybridRequestData) error {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()

	if folderPath == "" {
		return fmt.Errorf("Please initialize the folder where you want to store data")
	}

	keysDir := filepath.Join(folderPath, "keys/asymmetric", req.AsymAlgType, req.FolderName)

	// Check if the specified FolderName already exists
	if _, err := os.Stat(keysDir); !os.IsNotExist(err) {
		return fmt.Errorf("The folder with the name '%s' already exists. Please specify a new name for the data.", req.FolderName)
	}

	// Create the keys directory
	err := os.MkdirAll(keysDir, os.ModePerm)
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	// Create the directory for the algorithm type within the folder
	algorithmDir := filepath.Join(keysDir, req.AlgSymEnc)
	if err := os.MkdirAll(algorithmDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create algorithm directory: %v", err)
	}

	// Define the full paths for the files
	symmetricDataFilePath := filepath.Join(algorithmDir, "symmetric_data.enc")
	encryptedPassphraseFilePath := filepath.Join(keysDir, "encrypted_passphrase.key")
	signatureFilePath := filepath.Join(keysDir, "signature.sig")

	// Write the symmetric data to the file
	err = os.WriteFile(symmetricDataFilePath, []byte(req.SymmetricData), 0644)
	if err != nil {
		return fmt.Errorf("failed to write symmetric data: %v", err)
	}

	// Write the encrypted passphrase to the file
	err = os.WriteFile(encryptedPassphraseFilePath, []byte(req.EncyrptedPassphrase), 0644)
	if err != nil {
		return fmt.Errorf("failed to write encrypted passphrase: %v", err)
	}

	// Write the signature to the file
	err = os.WriteFile(signatureFilePath, []byte(req.Signature), 0644)
	if err != nil {
		return fmt.Errorf("failed to write signature: %v", err)
	}

	fmt.Printf("Data saved successfully in %s\n", keysDir)
	return nil
}
