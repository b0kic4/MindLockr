package decryptiontests

import (
	"MindLockr/server/cryptography/decryption"
	"MindLockr/server/cryptography/encryption"
	"testing"
)

func TestEmptyData(t *testing.T) {
	decrypt := &decryption.Cryptography{}
	originalData := ""
	passphrase := "mypassword"

	encryptData := encryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-128 encryption
	encryptedData, err := encryption.AES128Encryption(encryptData)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	// Check that the encrypted data is not the same as the original data
	if encryptedData == originalData {
		t.Errorf("Encrypted data should not match the original plaintext")
	}

	// Prepare decryption request
	decryptData := decryption.DataToDecrypt{
		EncryptedData: encryptedData,
		Passphrase:    passphrase,
	}

	// Perform AES-128 decryption
	decryptedData, err := decrypt.AES128Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}
