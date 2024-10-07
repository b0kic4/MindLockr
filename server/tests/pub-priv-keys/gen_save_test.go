package pubprivkeys_test

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	"MindLockr/server/filesystem"
	"MindLockr/server/filesystem/keys"
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/pem"
	"os"
	"path/filepath"
	"testing"
)

func setupTestDir(t *testing.T) string {
	dir, err := os.MkdirTemp("", "keytest")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	return dir
}

func teardownTestDir(t *testing.T, dir string) {
	err := os.RemoveAll(dir)
	if err != nil {
		t.Fatalf("failed to remove temp dir: %v", err)
	}
}

func decryptPrivateKey(t *testing.T, filePath string, passphrase string) []byte {
	// Read the encrypted private key file
	encryptedKeyData, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("failed to read encrypted private key file: %v", err)
	}

	// Decrypt the private key
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

	// Update the folder path in the singleton Folder instance
	folderInstance := filesystem.GetFolderInstance()
	folderInstance.UpdateFolderPath(dir)

	// Create an instance of PubPrvKeyGen
	keyGen := &keys.PubPrvKeyGen{}

	// Define test request data
	req := keys.RequestData{
		Passphrase: "testpassphrase",
	}

	// Generate the private and public keys
	result, err := keyGen.GeneratePrivatePublicKeys(req)
	if err != nil {
		t.Fatalf("failed to generate keys: %v", err)
	}

	// Check if private and public keys are non-empty
	if result.PrivKey == "" {
		t.Fatal("private key is empty")
	}
	if result.PubKey == "" {
		t.Fatal("public key is empty")
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
	publicKeyData, err := os.ReadFile(publicKeyPath)
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

func TestKeyRetrieval(t *testing.T) {
	// Setup test folder
	dir := setupTestDir(t)
	defer teardownTestDir(t, dir) // Cleanup after the test

	// Update the folder path in the singleton Folder instance
	folderInstance := filesystem.GetFolderInstance()
	folderInstance.UpdateFolderPath(dir)

	// Create an instance of PubPrvKeyGen
	keyGen := &keys.PubPrvKeyGen{}

	// Define test request data
	req := keys.RequestData{
		Passphrase: "testpassphrase",
	}

	// Generate the private and public keys
	_, err := keyGen.GeneratePrivatePublicKeys(req)
	if err != nil {
		t.Fatalf("failed to generate keys: %v", err)
	}

	// Retrieve the public key
	pubKeyPEM, err := keyGen.RetrievePubKey()
	if err != nil {
		t.Fatalf("failed to retrieve public key: %v", err)
	}

	if pubKeyPEM == "" {
		t.Fatal("retrieved public key is empty")
	}

	// Validate the retrieved public key
	block, _ := pem.Decode([]byte(pubKeyPEM))
	if block == nil || block.Type != "PUBLIC KEY" {
		t.Fatalf("failed to decode PEM block containing public key")
	}

	pubKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse public key: %v", err)
	}

	_, ok := pubKeyInterface.(*ecdsa.PublicKey)
	if !ok {
		t.Fatalf("public key is not of type *ecdsa.PublicKey")
	}

	// Retrieve the private key
	privKeyPEM, err := keyGen.RetrievePrivKey(req.Passphrase)
	if err != nil {
		t.Fatalf("failed to retrieve private key: %v", err)
	}

	if privKeyPEM == "" {
		t.Fatal("retrieved private key is empty")
	}

	// Validate the retrieved private key
	block, _ = pem.Decode([]byte(privKeyPEM))
	if block == nil || block.Type != "EC PRIVATE KEY" {
		t.Fatalf("failed to decode PEM block containing private key")
	}

	_, err = x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse EC private key: %v", err)
	}
}

func TestCryptographicOperations(t *testing.T) {
	// Setup test folder
	dir := setupTestDir(t)
	defer teardownTestDir(t, dir) // Cleanup after the test

	// Update the folder path in the singleton Folder instance
	folderInstance := filesystem.GetFolderInstance()
	folderInstance.UpdateFolderPath(dir)

	// Create an instance of PubPrvKeyGen
	keyGen := &keys.PubPrvKeyGen{}

	// Define test request data
	req := keys.RequestData{
		Passphrase: "testpassphrase",
	}

	// Generate the private and public keys
	_, err := keyGen.GeneratePrivatePublicKeys(req)
	if err != nil {
		t.Fatalf("failed to generate keys: %v", err)
	}

	// Retrieve the keys
	privKeyPEM, err := keyGen.RetrievePrivKey(req.Passphrase)
	if err != nil {
		t.Fatalf("failed to retrieve private key: %v", err)
	}
	pubKeyPEM, err := keyGen.RetrievePubKey()
	if err != nil {
		t.Fatalf("failed to retrieve public key: %v", err)
	}

	// Parse the private key
	block, _ := pem.Decode([]byte(privKeyPEM))
	if block == nil || block.Type != "EC PRIVATE KEY" {
		t.Fatalf("failed to decode PEM block containing private key")
	}
	privKey, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse EC private key: %v", err)
	}

	// Parse the public key
	block, _ = pem.Decode([]byte(pubKeyPEM))
	if block == nil || block.Type != "PUBLIC KEY" {
		t.Fatalf("failed to decode PEM block containing public key")
	}
	pubKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		t.Fatalf("failed to parse public key: %v", err)
	}
	pubKey, ok := pubKeyInterface.(*ecdsa.PublicKey)
	if !ok {
		t.Fatalf("public key is not of type *ecdsa.PublicKey")
	}

	// Perform signing and verification
	message := []byte("Test message for signing")
	hash := sha256.Sum256(message)

	r, s, err := ecdsa.Sign(rand.Reader, privKey, hash[:])
	if err != nil {
		t.Fatalf("failed to sign message: %v", err)
	}

	valid := ecdsa.Verify(pubKey, hash[:], r, s)
	if !valid {
		t.Fatal("signature verification failed")
	}
}
