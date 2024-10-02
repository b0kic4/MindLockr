package decryption

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"golang.org/x/crypto/pbkdf2"
)

type DataToDecrypt struct {
	EncryptedData string `json:"encryptedData"`
	Passphrase    string `json:"passphrase"`
}

type Cryptography struct{}

// AES128Decryption decrypts AES-128 encrypted data
func (c *Cryptography) AES128Decryption(data DataToDecrypt) (string, error) {
	// Decode the hex-encoded encrypted string into bytes
	encryptedBytes, err := hex.DecodeString(data.EncryptedData)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted data: %v", err)
	}

	// Extract the salt (first 16 bytes)
	if len(encryptedBytes) < 32 {
		return "", fmt.Errorf("encrypted data too short")
	}
	salt := encryptedBytes[:16]

	// Derive the AES-128 key using PBKDF2
	key := pbkdf2.Key([]byte(data.Passphrase), salt, 4096, 16, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Extract the IV (next 16 bytes after the salt)
	iv := encryptedBytes[16:32]

	// Extract the ciphertext (everything after the salt and IV)
	cipherText := encryptedBytes[32:]

	// Create a CFB decrypter with the block and IV
	stream := cipher.NewCFBDecrypter(block, iv)

	// Decrypt the ciphertext
	stream.XORKeyStream(cipherText, cipherText)

	// Return the decrypted plaintext as a string
	return string(cipherText), nil
}

// AES192Decryption decrypts AES-192 encrypted data
func (c *Cryptography) AES192Decryption(data DataToDecrypt) (string, error) {
	// Decode the hex-encoded encrypted string into bytes
	encryptedBytes, err := hex.DecodeString(data.EncryptedData)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted data: %v", err)
	}

	// Extract the salt (first 16 bytes)
	if len(encryptedBytes) < 32 {
		return "", fmt.Errorf("encrypted data too short")
	}
	salt := encryptedBytes[:16]

	// Derive the AES-192 key using PBKDF2
	key := pbkdf2.Key([]byte(data.Passphrase), salt, 4096, 24, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Extract the IV (next 16 bytes after the salt)
	iv := encryptedBytes[16:32]

	// Extract the ciphertext (everything after the salt and IV)
	cipherText := encryptedBytes[32:]

	// Create a CFB decrypter with the block and IV
	stream := cipher.NewCFBDecrypter(block, iv)

	// Decrypt the ciphertext
	stream.XORKeyStream(cipherText, cipherText)

	// Return the decrypted plaintext as a string
	return string(cipherText), nil
}

// AES256Decryption decrypts AES-256 encrypted data
func (c *Cryptography) AES256Decryption(data DataToDecrypt) (string, error) {
	// Decode the hex-encoded encrypted string into bytes
	encryptedBytes, err := hex.DecodeString(data.EncryptedData)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted data: %v", err)
	}

	// Extract the salt (first 16 bytes)
	if len(encryptedBytes) < 32 {
		return "", fmt.Errorf("encrypted data too short")
	}
	salt := encryptedBytes[:16]

	// Derive the AES-256 key using PBKDF2
	key := pbkdf2.Key([]byte(data.Passphrase), salt, 4096, 32, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Extract the IV (next 16 bytes after the salt)
	iv := encryptedBytes[16:32]

	// Extract the ciphertext (everything after the salt and IV)
	cipherText := encryptedBytes[32:]

	// Create a CFB decrypter with the block and IV
	stream := cipher.NewCFBDecrypter(block, iv)

	// Decrypt the ciphertext
	stream.XORKeyStream(cipherText, cipherText)

	// Return the decrypted plaintext as a string
	return string(cipherText), nil
}
