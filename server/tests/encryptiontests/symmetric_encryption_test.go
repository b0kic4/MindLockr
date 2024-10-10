package symmetricecnryptiontests

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"testing"
)

func TestEncryptDecryptAES128(t *testing.T) {
	// Test data and passphrase
	originalData := "This is a test message for AES-128 symmetricecnryption."
	passphrase := "mystrongpassphrase"

	// Create request data
	encryptData := symmetricencryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-128 symmetricecnryption
	encryptedData, err := symmetricencryption.AES128Encryption(encryptData)
	if err != nil {
		t.Fatalf("symmetricecnryption failed: %v", err)
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

func TestEncryptDecryptAES192(t *testing.T) {
	originalData := "This is a test message for AES-192 symmetricecnryption."
	passphrase := "mystrongpassphrase"

	encryptData := symmetricencryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-192 symmetricecnryption
	encryptedData, err := symmetricencryption.AES192Encryption(encryptData)
	if err != nil {
		t.Fatalf("symmetricecnryption failed: %v", err)
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

	// Perform AES-192 decryption
	decryptedData, err := symmetricdecryption.AES192Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}

func TestEncryptDecryptAES256(t *testing.T) {
	originalData := "This is a test message for AES-256 symmetricecnryption."
	passphrase := "mystrongpassphrase"

	encryptData := symmetricencryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-256 symmetricecnryption
	encryptedData, err := symmetricencryption.AES256Encryption(encryptData)
	if err != nil {
		t.Fatalf("symmetricecnryption failed: %v", err)
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

	// Perform AES-256 decryption
	decryptedData, err := symmetricdecryption.AES256Decryption(decryptData)
	if err != nil {
		t.Fatalf("Decryption failed: %v", err)
	}

	// Ensure the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Decrypted data does not match the original. Got: %s, Expected: %s", decryptedData, originalData)
	}
}

func TestIncorrectPassphrase(t *testing.T) {
	originalData := "This is a test message for AES-128 symmetricecnryption."
	passphrase := "correctpassphrase"
	wrongPassphrase := "wrongpassphrase"

	encryptData := symmetricencryption.DataToEncrypt{
		Data:       originalData,
		Passphrase: passphrase,
	}

	// Perform AES-128 symmetricecnryption
	encryptedData, err := symmetricencryption.AES128Encryption(encryptData)
	if err != nil {
		t.Fatalf("symmetricecnryption failed: %v", err)
	}

	// Try to decrypt using an incorrect passphrase
	decryptData := symmetricdecryption.DataToDecrypt{
		EncryptedData: encryptedData,
		Passphrase:    wrongPassphrase,
	}

	// Perform AES-128 decryption
	decryptedData, err := symmetricdecryption.AES128Decryption(decryptData)
	if err == nil {
		// Even though decryption didn't produce an error, check if the output makes sense
		if decryptedData == originalData {
			t.Errorf("Decryption succeeded with an incorrect passphrase, but the decrypted data should not match the original data.")
		}
	} else {
		t.Logf("Decryption failed as expected with an incorrect passphrase: %v", err)
	}
}
