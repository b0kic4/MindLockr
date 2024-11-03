package keys

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/ProtonMail/gopenpgp/v3/constants"
	"github.com/ProtonMail/gopenpgp/v3/crypto"
	"github.com/ProtonMail/gopenpgp/v3/profile"
)

type (
	PgpKeysGen struct{}

	RequestData struct {
		Email      string
		Name       string
		EnType     string
		Usage      string
		Passphrase string
		Curve      string
		Bits       int
	}

	ReturnType struct {
		PrivKey string
		PubKey  string
	}
)

func (pgpKeysGen *PgpKeysGen) GeneratePGPKeys(req RequestData) (ReturnType, error) {
	switch req.EnType {
	case "ECC":

		return pgpKeysGen.GenerateEcPgpKeys(req)

	case "RSA":

		if req.Bits < 3072 || req.Bits > 4096 {
			return ReturnType{}, fmt.Errorf("RSA key generation requires a valid bit size (3072 <= x <= 4096)")
		}
		return pgpKeysGen.GenerateRsaPgpKeys(req)

	default:
		return ReturnType{}, fmt.Errorf("unsupported encryption type: %v", req.EnType)
	}
}

func (pgpKeysGen *PgpKeysGen) GenerateRsaPgpKeys(req RequestData) (ReturnType, error) {
	pgp4880 := crypto.PGPWithProfile(profile.RFC4880())
	keyGenHandle := pgp4880.KeyGeneration().AddUserId(req.Name, req.Email).New()

	var privKey, pubKey string

	switch req.Bits {
	case 4096:
		// Generate a High Security RSA Key (4096 bits)
		rsaKeyHigh, err := keyGenHandle.GenerateKeyWithSecurity(constants.HighSecurity)
		if err != nil {
			return ReturnType{}, fmt.Errorf("error occurred when generating HighSecurity RSA key: %s", err)
		}

		// Extract the public key (armored)
		pubKey, err = rsaKeyHigh.GetArmoredPublicKey()
		if err != nil {
			return ReturnType{}, fmt.Errorf("failed while extracting armored public key: %s", err)
		}

		lockedKey, err := pgp4880.LockKey(rsaKeyHigh, []byte(req.Passphrase))
		if err != nil {
			return ReturnType{}, fmt.Errorf("error when unlocking the private key: %s", err)
		}

		privKey, err = lockedKey.Armor()
		if err != nil {
			return ReturnType{}, fmt.Errorf("failed while extracting armored enc private key: %s", err)
		}

	case 3072:
		// Generate a Standard RSA Key (3072 bits)
		rsaKey, err := keyGenHandle.GenerateKey()
		if err != nil {
			return ReturnType{}, fmt.Errorf("error occurred when generating RSA key: %s", err)
		}

		// Extract the public key (armored)
		pubKey, err = rsaKey.GetArmoredPublicKey()
		if err != nil {
			return ReturnType{}, fmt.Errorf("failed while extracting armored public key: %s", err)
		}

		lockedKey, err := pgp4880.LockKey(rsaKey, []byte(req.Passphrase))
		if err != nil {
			return ReturnType{}, fmt.Errorf("error when unlocking the private key: %s", err)
		}

		privKey, err = lockedKey.Armor()
		if err != nil {
			return ReturnType{}, fmt.Errorf("failed while extracting armored enc private key: %s", err)
		}
	}

	var err error

	err = SavePgpPrivKey(privKey, req.Usage, req.EnType)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	err = SavePgpPublicKey(pubKey, req.Usage, req.EnType)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}

func (pgpKeysGen *PgpKeysGen) GenerateEcPgpKeys(req RequestData) (ReturnType, error) {
	pgp := crypto.PGPWithProfile(profile.RFC9580())

	keyGenHandle := pgp.KeyGeneration().AddUserId(req.Name, req.Email)
	var ecKey *crypto.Key
	var err error

	switch req.Curve {
	case "curve25519":
		ecKey, err = keyGenHandle.New().GenerateKeyWithSecurity(2)
		if err != nil {
			return ReturnType{}, fmt.Errorf("error while generating ecc key (curve25519): %s", err)
		}

	case "curve25519-refresh":
		ecKey, err = keyGenHandle.New().GenerateKeyWithSecurity(3)
		if err != nil {
			return ReturnType{}, fmt.Errorf("error while generating ecc key (curve25519-refresh): %s", err)
		}

	case "curve448":
		ecKey, err = keyGenHandle.New().GenerateKeyWithSecurity(4)
		if err != nil {
			return ReturnType{}, fmt.Errorf("error while generating ecc key (curve448): %s", err)
		}

	case "curve448-refresh":
		ecKey, err = keyGenHandle.New().GenerateKeyWithSecurity(5)
		if err != nil {
			return ReturnType{}, fmt.Errorf("error while generating ecc key (curve448-refresh): %s", err)
		}

	default:
		return ReturnType{}, fmt.Errorf("unsupported curve type: %v", req.Curve)
	}

	// Extract the public key (armored)
	pubKey, err := ecKey.GetArmoredPublicKey()
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed while extracting armored public key: %s", err)
	}

	// Lock the private key with the passphrase
	lockedKey, err := pgp.LockKey(ecKey, []byte(req.Passphrase))
	if err != nil {
		return ReturnType{}, fmt.Errorf("error when locking the private key: %s", err)
	}

	// Get the armored private key
	privKey, err := lockedKey.Armor()
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed while extracting armored private key: %s", err)
	}

	err = SavePgpPrivKey(privKey, req.Usage, req.EnType)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	err = SavePgpPublicKey(pubKey, req.Usage, req.EnType)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}

func (pgpKeysGen *PgpKeysGen) DecryptPgpPrivKey(passphrase string, keyPath string) (string, error) {
	// Read the armored encrypted private key from the file
	privKeyPath := filepath.Join(keyPath, "private.asc")

	encryptedPrivKeyArmor, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	// Load the armored key into a crypto.Key object
	encryptedKeyObj, err := crypto.NewKeyFromArmored(string(encryptedPrivKeyArmor))
	if err != nil {
		return "", fmt.Errorf("failed to parse armored private key: %v", err)
	}

	// Unlock the key using the passphrase
	unlockedKeyObj, err := encryptedKeyObj.Unlock([]byte(passphrase))
	if err != nil {
		return "", fmt.Errorf("failed to unlock private key %v", err)
	}

	// Optionally, you can re-armor the unlocked key if you need the decrypted armored key
	decryptedPrivKeyArmor, err := unlockedKeyObj.Armor()
	if err != nil {
		return "", fmt.Errorf("failed to armor unlocked private key: %v", err)
	}
	return decryptedPrivKeyArmor, nil
}
