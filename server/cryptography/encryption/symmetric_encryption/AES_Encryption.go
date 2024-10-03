package symmetricencryption

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"

	"golang.org/x/crypto/pbkdf2"
)

type RequestData struct {
	Data          string `json:"data"`
	Passphrase    string `json:"passphrase"`
	Algorithm     string `json:"algorithm"`
	AlgorithmType string `json:"algorithmType"`
}

type Cryptography struct{}

// when encrypting for the local
// we can have algorithm used for filesystem based
// but when sharing it that wont be secure

// EncryptAES performs AES encryption using AES-CFB mode
func (c *Cryptography) EncryptAES(req RequestData) (string, error) {
	if req.Algorithm != "AES" {
		return "", fmt.Errorf("unsupported algorithm: %s", req.Algorithm)
	}

	switch req.AlgorithmType {
	case "AES-128":
		return AES128Encryption(DataToEncrypt{Data: req.Data, Passphrase: req.Passphrase})
	case "AES-192":
		return AES192Encryption(DataToEncrypt{Data: req.Data, Passphrase: req.Passphrase})
	case "AES-256":
		return AES256Encryption(DataToEncrypt{Data: req.Data, Passphrase: req.Passphrase})
	default:
		return "", fmt.Errorf("unsupported AES type: %s", req.AlgorithmType)
	}
}

type DataToEncrypt struct {
	Data       string `json:"data"`
	Passphrase string `json:"passphrase"`
}

func AES128Encryption(data DataToEncrypt) (string, error) {
	bytePassphrase := []byte(data.Passphrase)

	// Generate a random 16-byte salt
	salt := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %v", err)
	}

	// Derive a 16-byte key for AES-128
	key := pbkdf2.Key(bytePassphrase, salt, 4096, 16, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Prepare the plain text
	plainText := []byte(data.Data)

	// Generate a random IV (Initialization Vector)
	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %v", err)
	}

	// Encrypt the plain text
	cipherText := make([]byte, len(plainText))
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText, plainText)

	finalCipherText := append(salt, iv...)
	finalCipherText = append(finalCipherText, cipherText...)

	return hex.EncodeToString(finalCipherText), nil
}

func AES192Encryption(data DataToEncrypt) (string, error) {
	bytePassphrase := []byte(data.Passphrase)

	// Generate a random 16-byte salt
	salt := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %v", err)
	}

	// Derive a 24-byte key for AES-192
	key := pbkdf2.Key(bytePassphrase, salt, 4096, 24, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Prepare the plain text
	plainText := []byte(data.Data)

	// Generate a random IV (Initialization Vector)
	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %v", err)
	}

	// Encrypt the plain text
	cipherText := make([]byte, len(plainText))
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText, plainText)

	// Prepend the salt and IV to the final cipher text (salt + IV + ciphertext)
	finalCipherText := append(salt, iv...)
	finalCipherText = append(finalCipherText, cipherText...)

	return hex.EncodeToString(finalCipherText), nil
}

func AES256Encryption(data DataToEncrypt) (string, error) {
	bytePassphrase := []byte(data.Passphrase)

	// Generate a random 16-byte salt
	salt := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %v", err)
	}

	// Derive a 32-byte key for AES-256
	key := pbkdf2.Key(bytePassphrase, salt, 4096, 32, sha256.New)

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	// Prepare the plain text
	plainText := []byte(data.Data)

	// Generate a random IV (Initialization Vector)
	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %v", err)
	}

	// Encrypt the plain text
	cipherText := make([]byte, len(plainText))
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText, plainText)

	// Prepend the salt and IV to the final cipher text (salt + IV + ciphertext)
	finalCipherText := append(salt, iv...)
	finalCipherText = append(finalCipherText, cipherText...)

	return hex.EncodeToString(finalCipherText), nil
}
