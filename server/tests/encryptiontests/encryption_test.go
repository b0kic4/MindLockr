package encryptiontests

import (
	"MindLockr/server/cryptography/decryption"
	"MindLockr/server/cryptography/encryption"
	"testing"
)

func TestEncryptDecryptAES128(t *testing.T) {
	// Test data and passphrase
	originalData := "This is a test message for AES-128 encryption."
	passphrase := "mystrongpassphrase"

	// Create request data
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
	decryptedData, err := decryption.AES128Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}

func TestEncryptDecryptAES192(t *testing.T) {
	originalData := "This is a test message for AES-192 encryption."
	passphrase := "mystrongpassphrase"

	encryptData := encryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-192 encryption
	encryptedData, err := encryption.AES192Encryption(encryptData)
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

	// Perform AES-192 decryption
	decryptedData, err := decryption.AES192Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}

func TestEncryptDecryptAES256(t *testing.T) {
	originalData := "This is a test message for AES-256 encryption."
	passphrase := "mystrongpassphrase"

	encryptData := encryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-256 encryption
	encryptedData, err := encryption.AES256Encryption(encryptData)
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

	// Perform AES-256 decryption
	decryptedData, err := decryption.AES256Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}

func TestIncorrectPassphrase(t *testing.T) {
	originalData := "This is a test message for AES-128 encryption."
	passphrase := "correctpassphrase"
	wrongPassphrase := "wrongpassphrase"

	encryptData := encryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-128 encryption
	encryptedData, err := encryption.AES128Encryption(encryptData)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}

	// Try to decrypt using an incorrect passphrase
	decryptData := decryption.DataToDecrypt{
		EncryptedData: encryptedData,
		Passphrase:    wrongPassphrase,
	}

	// Perform AES-128 decryption
	decryptedData, err := decryption.AES128Decryption(decryptData)
	if err == nil {
		// Even though decryption didn't produce an error, check if the output makes sense
		if decryptedData == originalData {
			t.Errorf("Decryption succeeded with an incorrect passphrase, but the decrypted data should not match the original data.")
		}
	} else {
		t.Logf("Decryption failed as expected with an incorrect passphrase: %v", err)
	}
}
