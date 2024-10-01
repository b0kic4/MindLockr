package encryption

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

// I need to save both the salt and the passphrase

// EncryptAES performs AES encryption using AES-CFB mode
// 16 bytes, 24 bytes, 32 bytes
// 128 bits, 192 bits, 256 bits

// so we need to have stored passphrase and the salt

func (c *Cryptography) EncryptAES(req RequestData) (string, error) {
	if req.Algorithm != "AES" {
		return "", fmt.Errorf("unsupported algorithm: %s", req.Algorithm)
	}

	switch req.AlgorithmType {
	case "AES-128":
		return AES128Encryption(DataToEncrypt{Data: req.Data, Passphrase: req.Passphrase})
	case "AES-192":
		fmt.Println("AES-192")
		return "", fmt.Errorf("AES-192 encryption not implemented yet")
	case "AES-256":
		fmt.Println("AES-256")
		return "", fmt.Errorf("AES-256 encryption not implemented yet")
	default:
		return "", fmt.Errorf("unsupported AES type: %s", req.AlgorithmType)
	}
}

type DataToEncrypt struct {
	Data       string `json:"data"`
	Passphrase string `json:"passphrase"`
}

// key derivation function (KDF) is a cryptographic algorithm
// that derives one or more secret keys from a secret value such as
// a master key, a password, or a passphrase using a pseudorandom function
// (which typically uses a cryptographic hash function or block cipher).
// KDFs can be used to stretch keys into longer keys or to obtain keys of a required format

// generating random IV
// we are using IV -> Initializaiton Vector for generating
// random byte array with length equal to AES block size
// aes.BlokcSize which is 16 bytes for AES
//
// io ReadFull rand.Reader, iv -> generates cryptographically secure random bytes
// to fill the IV. This ensures every encryption uses different IV, even if the same key
// and data used.
//
// IV Stroage in CipherText (we need it for the decryption) often stored or set along with ciphertext
// IV is stored in the first aes.BlockSize (16 bytes) of the cipherText slice: iv := cipherText[:aes.BlockSize].
//
// Without an IV, if the same plaintext is encrypted with the same key multiple times, the resulting ciphertext will be the same,
// which can reveal patterns and make the encryption vulnerable to certain attacks.
// The IV ensures that even if the same data is encrypted twice with the same key, the ciphertext will differ because the IV is unique for each encryption.
// In CFB mode (used in your encryption example), the IV is used to "seed" the encryption process for the first block of plaintext.

func AES128Encryption(data DataToEncrypt) (string, error) {
	// we should first create cipher.Block
	bytePassphrase := []byte(data.Passphrase)

	salt := make([]byte, 16)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		fmt.Println("err: ", err)
		return "", err
	}

	key := pbkdf2.Key(bytePassphrase, salt, 4096, 16, sha256.New)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}

	plainText := []byte(data.Data)
	// making cipher text big enough to hold the IV + the actual cipherText
	cipherText := make([]byte, aes.BlockSize+len(plainText))

	iv := cipherText[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", fmt.Errorf("failed to generate IV: %v", err)
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText[aes.BlockSize:], plainText)

	finalCipherText := append(salt, cipherText...)

	return hex.EncodeToString(finalCipherText), nil
}

func AES192Encryption(data DataToEncrypt) {
}

func AES256Encryption(data DataToEncrypt) {
}
