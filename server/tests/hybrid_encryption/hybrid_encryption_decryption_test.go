package hybridencryption_test

import (
	hybriddecryption "MindLockr/server/cryptography/decryption/hybrid_decryption"
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	hybridencryption "MindLockr/server/cryptography/encryption/hybrid_encryption"
	"testing"
)

const (
	pubKeyB64  = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE0/X9LuHVVZWPnIHQDhHJTFMDASiR5o3+syXdCfTESvw/kO78wPaCFzBnCZMvCqfXTwtMQ+RmHZN4fNtsky0PWg=="
	privKeyB64 = "MHcCAQEEILRcB/1/CQrV89lY+527LUImAoP6n7zTgo0ov9sBy9zeoAoGCCqGSM49AwEHoUQDQgAE0/X9LuHVVZWPnIHQDhHJTFMDASiR5o3+syXdCfTESvw/kO78wPaCFzBnCZMvCqfXTwtMQ+RmHZN4fNtsky0PWg=="
)

func TestHybridEncryptionAndDecryption(t *testing.T) {
	// Define test data and passphrase
	originalPassphrase := "mySecurePassphrase"
	originalData := "This is some sample data to encrypt."

	// Set up request data for encryption
	requestData := hybridencryption.RequestData{
		Data:          originalData,
		Passphrase:    originalPassphrase,
		Algorithm:     "AES",
		AlgorithmType: "AES-256",
		PubKey:        pubKeyB64,
		PrivKey:       privKeyB64,
	}

	// Encrypt the data
	he := &hybridencryption.HybridEncryption{}
	response, err := he.EncryptSharedData(requestData)
	if err != nil {
		t.Fatalf("Encryption failed: %v", err)
	}
	t.Logf("AES Encrypted Data: %s", response.SymmetricData)
	t.Logf("Encrypted Passphrase (Base64): %s", response.EncryptedPassphrase)
	t.Logf("Signature (Base64): %s", response.Signature)

	// Decrypt the passphrase
	hpd := &hybriddecryption.HybridPassphraseDecryption{}
	decryptedPassphrase, err := hpd.DecryptPassphrase(response.EncryptedPassphrase, privKeyB64)
	if err != nil {
		t.Fatalf("Decryption of passphrase failed: %v", err)
	}
	t.Logf("Decrypted Passphrase: %s", decryptedPassphrase)

	// Check if the decrypted passphrase matches the original
	if decryptedPassphrase != originalPassphrase {
		t.Errorf("Passphrase decryption failed: expected %s, got %s", originalPassphrase, decryptedPassphrase)
	} else {
		t.Log("Decryption successful: Passphrase matches the original.")
	}

	// Decrypt the AES encrypted data using the decrypted passphrase
	symDec := &symmetricdecryption.Cryptography{}
	decryptRequest := symmetricdecryption.DataToDecrypt{
		EncryptedData: response.SymmetricData,
		Passphrase:    decryptedPassphrase,
	}
	decryptedData, err := symDec.DecryptAES("AES-256", decryptRequest)
	if err != nil {
		t.Fatalf("Decryption of data failed: %v", err)
	}
	t.Logf("Decrypted Data: %s", decryptedData)

	// Verify if the decrypted data matches the original data
	if decryptedData != originalData {
		t.Errorf("Data decryption failed: expected %s, got %s", originalData, decryptedData)
	} else {
		t.Log("Decryption successful: Data matches the original.")
	}
}
