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

func (c *Cryptography) EncryptAES(req RequestData) (string, error) {
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
	return encrypt(data, 16)
}

func AES192Encryption(data DataToEncrypt) (string, error) {
	return encrypt(data, 24)
}

func AES256Encryption(data DataToEncrypt) (string, error) {
	return encrypt(data, 32)
}

// 1. Generate a random 16-byte salt
// 2. Derive the AES key using PBKDF2 with the passphrase and salt
// 3. Create AES cipher block
// 4. Generate a random IV (Initialization Vector)
// 5. Encrypt the plaintext data
// Create a CFB encrypter with the block and IV
// 6. Prepend the salt and IV to the ciphertext
// 7.: Return the final ciphertext as a hex string

func encrypt(data DataToEncrypt, keySize int) (string, error) {
	salt := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", fmt.Errorf("failed to generate salt: %v", err)
	}

	key := pbkdf2.Key([]byte(data.Passphrase), salt, 4096, keySize, sha256.New)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %v", err)
	}

	plainText := []byte(data.Data)
	cipherText := make([]byte, len(plainText))

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText, plainText)

	finalCipherText := append(salt, iv...)
	finalCipherText = append(finalCipherText, cipherText...)

	return hex.EncodeToString(finalCipherText), nil
}
