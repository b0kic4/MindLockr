package hybenc

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type (
	HybEnc struct{}

	RequestData struct {
		Data              string `json:"data"`
		Passphrase        string `json:"passphrase"`
		PrivKeyPassphrase string `json:"privPassphrase"`
		PubKey            string `json:"pubKey"`
		PrivKey           string `json:"privKey"`
	}

	SaveAsymmetricDataRequest struct {
		SymmetricData       string
		AlgSymEnc           string
		EncryptedPassphrase string
		Signature           string
	}
)

// I need to have the experation date of the
// keys for user to assign when the keys should expire

// TODO: I should implement:
// 1. encrypt and sign function
// 2. encrypt function
// 3. sign function
// 4. decrypt and validate
// 5. validate
// 6. decrypt

func (he *HybEnc) EncryptAndSign(req RequestData) (string, error) {
	recipientPubKey, err := crypto.NewKeyFromArmored(req.PubKey)
	if err != nil {
		return "", fmt.Errorf("failed to ge the pub key from armored in hyb en: %s", err)
	}

	sendersPrivKey, err := crypto.NewPrivateKeyFromArmored(req.PrivKey, []byte(req.PrivKeyPassphrase))
	if err != nil {
		return "", fmt.Errorf("failed to ge the priv key from armored in hyb en: %s", err)
	}

	pgp := crypto.PGP()

	encHandle, err := pgp.Encryption().Password([]byte(req.Passphrase)).Recipient(recipientPubKey).SigningKey(sendersPrivKey).New()
	if err != nil {
		return "", fmt.Errorf("failed to create an encryption handle for aes encryption check parameters passed: %s", err)
	}

	pgpMessage, err := encHandle.Encrypt([]byte(req.Data))
	if err != nil {
		return "", fmt.Errorf("failed to encrypt the plain text data into aes encryption: %s", err)
	}

	pgpArmor, err := pgpMessage.ArmorBytes()
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}

	encHandle.ClearPrivateParams()

	return string(pgpArmor), nil
}
