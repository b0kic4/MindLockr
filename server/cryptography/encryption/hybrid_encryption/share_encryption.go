package hybridencryption

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type HybridEncryption struct{}

type RequestData struct {
	Data       string `json:"data"`
	Passphrase string `json:"passphrase"`
	Algorithm  string `json:"algorithm,omitempty"`
	FolderName string `json:"folderName"`
	PubKey     string `json:"pubKey"`
	PrivKey    string `json:"privKey"`
}

type ResponseData struct {
	SymmetricData       string
	EncryptedPassphrase string
	Signature           string
}

type SaveAsymmetricDataRequest struct {
	SymmetricData       string
	AlgSymEnc           string
	EncryptedPassphrase string
	Signature           string
	FolderName          string
}

// I need to have the experation date of the
// keys for user to assign when the keys should expire

// I should implement:
// 1. encrypt and sign function
// 2. encrypt function
// 3. sign function
// 4. decrypt and validate
// 5. validate
// 6. decrypt

func (he *HybridEncryption) HybEn(req RequestData) (ResponseData, error) {
	recipientPubKey, err := crypto.NewKeyFromArmored(req.PubKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to ge the pub key from armored in hyb en: %s", err)
	}

	// might need to see how to handle the private key decrypting
	// for now it will be with NewKeyFromArmored,
	// but we can use the NewPrivateKeyFromArmored(privKey string, []byte(passphrase))

	sendersPrivKey, err := crypto.NewKeyFromArmored(req.PrivKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to ge the priv key from armored in hyb en: %s", err)
	}

	pgp := crypto.PGP()

	encHandle, err := pgp.Encryption().Password([]byte(req.Passphrase)).Recipient(recipientPubKey).SigningKey(sendersPrivKey).New()
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to create an encryption handle for aes encryption check parameters passed: %s", err)
	}

	pgpMessage, err := encHandle.Encrypt([]byte(req.Data))
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to encrypt the plain text data into aes encryption: %s", err)
	}

	fmt.Println("pgpMessage: ", string(pgpMessage.Bytes()))

	return ResponseData{}, nil
}

// for transorming the already encrypted symmetric data into sharable hybrid enc
func (he *HybridEncryption) TrasformHybEn(req RequestData) (ResponseData, error) {
	return ResponseData{}, nil
}
