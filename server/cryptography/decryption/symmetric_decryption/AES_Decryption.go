package symmetricdecryption

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type DataToDecrypt struct {
	EncryptedData string `json:"encryptedData"`
	Passphrase    string `json:"passphrase"`
}

type Cryptography struct{}

func (c *Cryptography) DecryptAES(data DataToDecrypt) (string, error) {
	pgp := crypto.PGP()

	decHandle, err := pgp.Decryption().Password([]byte(data.Passphrase)).New()
	if err != nil {
		return "", fmt.Errorf("failed to create an encryption handle for aes encryption check parameters passed: %s", err)
	}
	decrypted, err := decHandle.Decrypt([]byte(data.EncryptedData), crypto.Armor)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt the data: %s", err)
	}

	return string(decrypted.Bytes()), nil
}
