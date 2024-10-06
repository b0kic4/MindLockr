package symmetricdecryption

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

func (c *Cryptography) DecryptAES(algorithmType string, data DataToDecrypt) (string, error) {
	switch algorithmType {
	case "AES-128":
		return AES128Decryption(data)
	case "AES-192":
		return AES192Decryption(data)
	case "AES-256":
		return AES256Decryption(data)
	default:
		return "", fmt.Errorf("unsupported AES type: %s", algorithmType)
	}
}

func AES128Decryption(data DataToDecrypt) (string, error) {
	return decrypt(data, 16)
}

func AES192Decryption(data DataToDecrypt) (string, error) {
	return decrypt(data, 24)
}

func AES256Decryption(data DataToDecrypt) (string, error) {
	return decrypt(data, 32)
}

// 1. Decode the hex-encoded encrypted string into bytes
// 2. Ensure the encrypted data is long enough to contain both the salt and IV
// 3. Extract the salt (first 16 bytes)
// 4. Derive the AES key using PBKDF2 with the passphrase and salt
// 5.Create AES cipher block
// 6. Extract the IV (next 16 bytes after the salt)
// 7. Extract the ciphertext (everything after the salt and IV)
//  Create a CFB decrypter with the block and IV
// 8. Decrypt the ciphertext in-place
// 9. Return the decrypted plaintext as a string

func decrypt(data DataToDecrypt, keySize int) (string, error) {
	encryptedBytes, err := hex.DecodeString(data.EncryptedData)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted data: %v", err)
	}

	if len(encryptedBytes) < 32 {
		return "", fmt.Errorf("encrypted data too short")
	}

	salt := encryptedBytes[:16]

	key := pbkdf2.Key([]byte(data.Passphrase), salt, 4096, keySize, sha256.New)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	iv := encryptedBytes[16:32]

	cipherText := encryptedBytes[32:]

	stream := cipher.NewCFBDecrypter(block, iv)

	stream.XORKeyStream(cipherText, cipherText)

	return string(cipherText), nil
}
