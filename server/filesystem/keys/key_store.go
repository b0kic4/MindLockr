package keys

import (
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"MindLockr/server/filesystem"
	"crypto"
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"path/filepath"
)

type KeyStore struct{}

// SaveSymmetricKey saves a symmetric encryption key to the specified folder
func (ks *KeyStore) SaveSymmetricKey(folderPath, fileName, keyContent, algorithmUsed string) error {
	// Ensure the 'keys/symmetric/algorithmUsed' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys/symmetric", algorithmUsed)
	if err := os.MkdirAll(keysDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create keys/symmetric/%s directory: %v", algorithmUsed, err)
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
func (ks *KeyStore) SaveAsymmetricKey(folderPath, fileName, keyContent string, algorithmUsed string) error {
	// Ensure the 'keys/symmetric' subdirectory exists
	keysDir := filepath.Join(folderPath, "keys/asymmetric", algorithmUsed)
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

// when saving the keys on the filesystem
// the public key should be saved as a plain text
// but the private key should be encrypted with the AES encryption

func SavePrivateKey(privKey crypto.PrivateKey, passphrase string) error {
	folderInstance := filesystem.GetFolderInstance()
	keysDir := filepath.Join(folderInstance.GetFolderPath(), "priv-pub")

	err := os.MkdirAll(keysDir, os.ModePerm)
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "private.pem")

	ecdsaPrivKey, ok := privKey.(*ecdsa.PrivateKey)
	if !ok {
		return fmt.Errorf("unsupported private key type")
	}

	keyBytes, err := x509.MarshalECPrivateKey(ecdsaPrivKey)
	if err != nil {
		return fmt.Errorf("failed to marshal private key: %v", err)
	}

	privPemBlock := &pem.Block{
		Type:  "EC PRIVATE KEY",
		Bytes: keyBytes,
	}

	pemEncodedPrivKey := pem.EncodeToMemory(privPemBlock)

	encryptedPrivKey, err := symmetricencryption.AES256Encryption(symmetricencryption.DataToEncrypt{
		Data:       string(pemEncodedPrivKey),
		Passphrase: passphrase,
	})
	if err != nil {
		return fmt.Errorf("failed to encrypt private key: %v", err)
	}

	err = os.WriteFile(keyFilePath, []byte(encryptedPrivKey), 0644)
	if err != nil {
		return fmt.Errorf("failed to write private key to file: %v", err)
	}

	return nil
}

func SavePublicKey(pubKey crypto.PublicKey) error {
	folderInstance := filesystem.GetFolderInstance()
	keysDir := filepath.Join(folderInstance.GetFolderPath(), "priv-pub")

	err := os.MkdirAll(keysDir, os.ModePerm)
	if err != nil {
		return fmt.Errorf("failed to create keys directory: %v", err)
	}

	keyFilePath := filepath.Join(keysDir, "public.pem")

	pubKeyBytes, err := x509.MarshalPKIXPublicKey(pubKey)
	if err != nil {
		return fmt.Errorf("failed to marshal public key: %v", err)
	}

	pubPemBlock := &pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: pubKeyBytes,
	}

	keyFile, err := os.Create(keyFilePath)
	if err != nil {
		return fmt.Errorf("failed to create public key file: %v", err)
	}
	defer keyFile.Close()

	err = pem.Encode(keyFile, pubPemBlock)
	if err != nil {
		return fmt.Errorf("failed to encode public key to PEM: %v", err)
	}

	return nil
}
