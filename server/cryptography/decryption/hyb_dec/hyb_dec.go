package hybdec

import (
	"fmt"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type (
	HybDec struct{}

	RequestData struct {
		PgpMessage        string `json:"data"`
		PrivKeyPassphrase string `json:"privPassphrase,omitempty"`
		FolderName        string `json:"folderName,omitempty"`
		PubKey            string `json:"pubKey,omitempty"`
		PrivKey           string `json:"privKey,omitempty"`
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

	decrypted, err := decHandle.Decrypt([]byte(req.PgpMessage), crypto.Armor)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to decrypt message: %s", err)
	}

	if sigErr := decrypted.SignatureError(); sigErr != nil {
		return ReturnType{
			data:  string(decrypted.Bytes()),
			valid: false,
		}, fmt.Errorf("signature verification failed: %s", sigErr)
	}

	return ReturnType{
		data:  string(decrypted.Bytes()),
		valid: true,
	}, nil
}

func (hd *HybDec) Decrypt(req RequestData) (ReturnType, error) {
	pgp := crypto.PGP()

	recievers, err := crypto.NewPrivateKeyFromArmored(req.PrivKey, []byte(req.PrivKeyPassphrase))
	if err != nil {
		fmt.Println("Error loading receiver's private key:", err)
		return ReturnType{}, fmt.Errorf("failed to get the priv key from armored in hyb en: %s", err)
	}

	decHandle, err := pgp.Decryption().
		DecryptionKey(recievers).
		New()
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to create decryption handle: %s", err)
	}
	defer decHandle.ClearPrivateParams()

	decrypted, err := decHandle.Decrypt([]byte(req.PgpMessage), crypto.Armor)
	if err != nil {
		fmt.Println("Error decrypting message:", err)
		return ReturnType{}, fmt.Errorf("failed to decrypt message: %s", err)
	}

	return ReturnType{
		data: string(decrypted.Bytes()),
	}, nil
}

func (hd *HybDec) ValidateSignature(req RequestData) (bool, error) {
	pgp := crypto.PGP()

	sendersPubKey, err := crypto.NewKeyFromArmored(req.PubKey)
	if err != nil {
		return false, fmt.Errorf("failed to load sender's public key: %s", err)
	}

	recieversPrivKey, err := crypto.NewPrivateKeyFromArmored(req.PrivKey, []byte(req.PrivKeyPassphrase))
	if err != nil {
		return false, fmt.Errorf("failed to load receiver's private key: %s", err)
	}

	decHandle, err := pgp.Decryption().
		DecryptionKey(recieversPrivKey).
		VerificationKey(sendersPubKey).
		New()
	if err != nil {
		return false, fmt.Errorf("failed to create decryption handle: %s", err)
	}
	defer decHandle.ClearPrivateParams()

	decrypted, err := decHandle.Decrypt([]byte(req.PgpMessage), crypto.Armor)
	if err != nil {
		return false, fmt.Errorf("failed to decrypt: %s", err)
	}

	if sigErr := decrypted.SignatureError(); sigErr != nil {
		return false, fmt.Errorf("signature verification failed: %s", sigErr)
	}

	fmt.Println("signature is valid")

	return true, nil
}
