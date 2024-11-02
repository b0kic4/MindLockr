package symmetricencryption

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type RequestData struct {
	Data          string `json:"data"`
	Passphrase    string `json:"passphrase"`
	Algorithm     string `json:"algorithm"`
	AlgorithmType string `json:"algorithmType"`
}

type DataToEncrypt struct {
	Data       string `json:"data"`
	Passphrase string `json:"passphrase"`
}

type Cryptography struct{}

func (c *Cryptography) EncryptAES(req RequestData) (string, error) {
	pgp := crypto.PGP()
	encHandle, err := pgp.Encryption().Password([]byte(req.Passphrase)).New()
	if err != nil {
		return "", fmt.Errorf("failed to create an encryption handle for aes encryption check parameters passed: %s", err)
	}

	pgpMessage, err := encHandle.Encrypt([]byte(req.Data))
	if err != nil {
		return "", fmt.Errorf("failed to encrypt the plain text data into aes encryption: %s", err)
	}

	armored, err := pgpMessage.ArmorBytes()
	if err != nil {
		return "", fmt.Errorf("failed to get armored message from the aes encryption: %s", err)
	}

	return string(armored), nil
}
