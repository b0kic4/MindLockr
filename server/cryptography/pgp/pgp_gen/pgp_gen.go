package pgpgen

import (
	pgpfs "MindLockr/server/filesystem/pgp_fs"
	"fmt"

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

		return pgpKeysGen.GenStoreECC(req)

	case "RSA":

		if req.Bits < 3072 || req.Bits > 4096 {
			return ReturnType{}, fmt.Errorf("RSA key generation requires a valid bit size (3072 <= x <= 4096)")
		}
		return pgpKeysGen.GenStoreRSA(req)

	default:
		return ReturnType{}, fmt.Errorf("unsupported encryption type: %v", req.EnType)
	}
}

// generate with storing
func (pgpKeysGen *PgpKeysGen) GenStoreRSA(req RequestData) (ReturnType, error) {
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

	err = pgpfs.SavePgpPrivKey(privKey, req.Usage)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	err = pgpfs.SavePgpPublicKey(pubKey, req.Usage)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}

func (pgpKeysGen *PgpKeysGen) GenStoreECC(req RequestData) (ReturnType, error) {
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

	err = pgpfs.SavePgpPrivKey(privKey, req.Usage)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	err = pgpfs.SavePgpPublicKey(pubKey, req.Usage)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}

// generate without storing

func (pgpKeysGen *PgpKeysGen) GenRSA(req RequestData) (ReturnType, error) {
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

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}

func (pgpKeysGen *PgpKeysGen) GenECC(req RequestData) (ReturnType, error) {
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

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}
