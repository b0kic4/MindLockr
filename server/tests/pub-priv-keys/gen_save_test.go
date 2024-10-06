package pubprivkeys_test

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	"MindLockr/server/filesystem"
	"MindLockr/server/filesystem/keys"
	"crypto/x509"
	"encoding/pem"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"
)

// Helper to create a temporary directory for testing
func setupTestDir(t *testing.T) string {
	dir, err := ioutil.TempDir("", "keytest")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	return dir
}

// Helper to remove temporary directory after the test
func teardownTestDir(t *testing.T, dir string) {
	err := os.RemoveAll(dir)
	if err != nil {
		t.Fatalf("failed to remove temp dir: %v", err)
	}
}

// Helper function to decrypt the private key before decoding
func decryptPrivateKey(t *testing.T, filePath string, passphrase string) []byte {
	// Read the encrypted private key file
	encryptedKeyData, err := ioutil.ReadFile(filePath)
	if err != nil {
		t.Fatalf("failed to read encrypted private key file: %v", err)
	}

	// Decrypt the private key using AES256Decryption
	decryptedKey, err := symmetricdecryption.AES256Decryption(symmetricdecryption.DataToDecrypt{
		EncryptedData: string(encryptedKeyData),
		Passphrase:    passphrase,
	})
	if err != nil {
		t.Fatalf("failed to decrypt private key: %v", err)
	}

	return []byte(decryptedKey)
}

func TestGenerationAndSaving(t *testing.T) {
	// Setup test folder
	dir := setupTestDir(t)
	defer teardownTestDir(t, dir) // Cleanup after the test

	folderInstance := filesystem.GetFolderInstance()
	folderInstance.UpdateFolderPath(dir)

	keyGen := &keys.PubPrvKeyGen{}

	req := keys.RequestData{
		Passphrase: "testpassphrase",
	}

	// Generate the private and public keys
	result, err := keyGen.GeneratePrivatePublicKeys(req)
	if err != nil {
		t.Fatalf("failed to generate keys: %v", err)
	}

	if result.PrivKey == nil {
		t.Fatal("private key is nil")
	}
	if result.PubKey == nil {
		t.Fatal("public key is nil")
	}

	// Verify that private key was saved correctly
	privateKeyPath := filepath.Join(dir, "priv-pub", "private.pem")
	if _, err := os.Stat(privateKeyPath); os.IsNotExist(err) {
		t.Fatalf("private key file not found: %v", err)
	}

	// Decrypt and validate the private key file content
	decryptedPrivateKeyData := decryptPrivateKey(t, privateKeyPath, req.Passphrase)

	block, _ := pem.Decode(decryptedPrivateKeyData)
	if block == nil || block.Type != "EC PRIVATE KEY" {
		t.Fatalf("failed to decode PEM block containing private key")
	}

	_, err = x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse EC private key: %v", err)
	}

	// Verify that public key was saved correctly
	publicKeyPath := filepath.Join(dir, "priv-pub", "public.pem")
	if _, err := os.Stat(publicKeyPath); os.IsNotExist(err) {
		t.Fatalf("public key file not found: %v", err)
	}

	// Read and validate the public key file content
	publicKeyData, err := ioutil.ReadFile(publicKeyPath)
	if err != nil {
		t.Fatalf("failed to read public key file: %v", err)
	}

	block, _ = pem.Decode(publicKeyData)
	if block == nil || block.Type != "PUBLIC KEY" {
		t.Fatalf("failed to decode PEM block containing public key")
	}

	_, err = x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse public key: %v", err)
	}
}
