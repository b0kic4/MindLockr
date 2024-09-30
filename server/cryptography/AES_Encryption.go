package cryptography

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"errors"
)

type RequestData struct {
	Data       string `json:"data"`
	Passphrase string `json:"passphrase"`
	Algorithm  string `json:"algorithm"`
}

type Cryptography struct{}

// EncryptAES performs AES encryption using AES-CFB mode
func (c *Cryptography) EncryptAES(req RequestData) (string, error) {
	block, err := aes.NewCipher([]byte(req.Passphrase)) // Using the passphrase for the key
	if err != nil {
		return "", err
	}

	if len(req.Data) == 0 || len(req.Passphrase) < aes.BlockSize {
		return "", errors.New("invalid input data or key")
	}

	ciphertext := make([]byte, aes.BlockSize+len(req.Data))
	iv := ciphertext[:aes.BlockSize] // Initial vector (IV)
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(req.Data))

	return hex.EncodeToString(ciphertext), nil
}
