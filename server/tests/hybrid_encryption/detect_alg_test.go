package hybridencryption_test

import (
	"MindLockr/server/filesystem/keys"
	"fmt"
	"testing"
)

type KeysData struct {
	EcPub   string
	EcPriv  string
	RsaPub  string
	RsaPriv string
}

func TestHybridEn(t *testing.T) {
	myKeys := KeysData{
		EcPub: `-----BEGIN PGP PUBLIC KEY----------END PGP PUBLIC KEY-----
`,
		EcPriv: `-----BEGIN PGP PRIVATE KEY----------END PGP PRIVATE KEY-----
`,
		RsaPub: `-----BEGIN PGP PUBLIC KEY----------END PGP PUBLIC KEY-----
`,
		RsaPriv: `-----BEGIN PGP PRIVATE KEY----------END PGP PRIVATE KEY-----
`,
	}

	fmt.Println(myKeys)

	kd := keys.KeyTypeDetection{}
	if keyType, err := kd.DetectKeyType(myKeys.EcPub); err == nil {
		fmt.Println("ECC Public Key Type:", keyType)
	} else {
		fmt.Println("Error detecting ECC public key type:", err)
	}

	if keyType, err := kd.DetectKeyType(myKeys.EcPriv); err == nil {
		fmt.Println("ECC Private Key Type:", keyType)
	} else {
		fmt.Println("Error detecting ECC private key type:", err)
	}

	if keyType, err := kd.DetectKeyType(myKeys.RsaPub); err == nil {
		fmt.Println("RSA Public Key Type:", keyType)
	} else {
		fmt.Println("Error detecting RSA public key type:", err)
	}

	if keyType, err := kd.DetectKeyType(myKeys.RsaPriv); err == nil {
		fmt.Println("RSA Private Key Type:", keyType)
	} else {
		fmt.Println("Error detecting RSA private key type:", err)
	}
}
