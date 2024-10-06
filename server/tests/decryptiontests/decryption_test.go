package decryptiontests

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"testing"
)

func TestEmptyData(t *testing.T) {
	originalData := ""
	passphrase := "mypassword"

	encryptData := symmetricencryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-128 encryption
	encryptedData, err := symmetricencryption.AES128Encryption(encryptData)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	// Check that the encrypted data is not the same as the original data
	if encryptedData == originalData {
		t.Errorf("Encrypted data should not match the original plaintext")
	}

	// Prepare decryption request
	decryptData := symmetricdecryption.DataToDecrypt{
		EncryptedData: encryptedData,
		Passphrase:    passphrase,
	}

	// Perform AES-128 decryption
	decryptedData, err := symmetricdecryption.AES128Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}
