package tests

import (
	hybenc "MindLockr/server/cryptography/encryption/hyb_enc"
	"MindLockr/server/filesystem/keys"
	"testing"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

func TestEncryptAndSignWithGeneratedECCKeys(t *testing.T) {
	// Step 1: Generate ECC keys using the GenECC function
	keyGen := &keys.PgpKeysGen{}
	keyRequest := keys.RequestData{
		Email:      "test@example.com",
		Name:       "Test User",
		EnType:     "ECC",
		Curve:      "curve25519",
		Passphrase: "testPassphrase",
	}

	generatedKeys, err := keyGen.GenECC(keyRequest)
	if err != nil {
		t.Fatalf("Failed to generate ECC keys: %s", err)
	}

	// Step 2: Set up the encryption request data
	req := hybenc.RequestData{
		Data:              "Sample data for encryption",
		Passphrase:        "testSymmetricPassphrase",
		PrivKeyPassphrase: keyRequest.Passphrase,
		PubKey:            generatedKeys.PubKey,
		PrivKey:           generatedKeys.PrivKey,
	}

	// Step 3: Initialize the HybEnc and call EncryptAndSign
	he := &hybenc.HybEnc{}
	encryptedData, err := he.EncryptAndSign(req)
	if err != nil {
		t.Fatalf("Encryption and signing failed: %s", err)
	}

	// Step 4: Validate the encrypted data is armored and can be parsed
	if encryptedData == "" {
		t.Fatal("Expected encrypted data to be non-empty")
	}

	_, err = crypto.NewPGPMessageFromArmored(encryptedData)
	if err != nil {
		t.Fatalf("Failed to decode armored message: %s", err)
	}

	t.Log("EncryptAndSign test with generated ECC keys passed, encrypted data is armored and valid.")
}
