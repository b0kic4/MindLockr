package hybdec

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type (
	HybDec struct{}

	RequestData struct {
		PgpMessage        string `json:"data"`
		PrivKeyPassphrase string `json:"privPassphrase"`
		FolderName        string `json:"folderName,omitempty"`
		PubKey            string `json:"pubKey"`
		PrivKey           string `json:"privKey"`
	}

	ReturnType struct {
		data  string
		valid bool
	}
)

// funcs:
// 1. decrypt and validate
// 2. decrypt
// 3. validate
// 4. decrypt from file pick
// 5. decrypt from textarea
func (hd *HybDec) DecryptAndValidate(req RequestData) (ReturnType, error) {
	pgp := crypto.PGP()

	sendersPubKey, err := crypto.NewKeyFromArmored(req.PubKey)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to get the pub key from armored in hyb en: %s", err)
	}

	recievers, err := crypto.NewPrivateKeyFromArmored(req.PrivKey, []byte(req.PrivKeyPassphrase))
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to get the priv key from armored in hyb en: %s", err)
	}

	decHandle, err := pgp.Decryption().
		DecryptionKey(recievers).
		VerificationKey(sendersPubKey).
		New()
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to create decryption handle: %s", err)
	}
	defer decHandle.ClearPrivateParams()

	// Decrypt armored message
	decrypted, err := decHandle.Decrypt([]byte(req.PgpMessage), crypto.Armor)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to decrypt message: %s", err)
	}

	// Verify signature
	if sigErr := decrypted.SignatureError(); sigErr != nil {
		return ReturnType{
			data:  string(decrypted.Bytes()),
			valid: false,
		}, fmt.Errorf("signature verification failed: %s", sigErr)
	}
	fmt.Println("Signature is valid.")

	return ReturnType{
		data:  string(decrypted.Bytes()),
		valid: true,
	}, nil
}
