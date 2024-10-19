package keys

import (
	"bytes"
	"fmt"

	"github.com/ProtonMail/go-crypto/openpgp"
	"github.com/ProtonMail/go-crypto/openpgp/packet"
)

type KeyTypeDetection struct{}

func (kd *KeyTypeDetection) DetectKeyType(keyData string) (string, error) {
	keyReader := bytes.NewReader([]byte(keyData))
	entityList, err := openpgp.ReadArmoredKeyRing(keyReader)
	if err != nil {
		return "", err
	}

	for _, entity := range entityList {
		pubKey := entity.PrimaryKey
		switch pubKey.PubKeyAlgo {
		case packet.PubKeyAlgoRSA, packet.PubKeyAlgoRSAEncryptOnly, packet.PubKeyAlgoRSASignOnly:
			return "RSA", nil
		case packet.PubKeyAlgoDSA:
			return "DSA", nil
		case packet.PubKeyAlgoECDH:
			return "ECDH", nil
		case packet.PubKeyAlgoECDSA:
			return "ECDSA", nil
		case packet.PubKeyAlgoEdDSA:
			return "EdDSA", nil
		case packet.PubKeyAlgoElGamal:
			return "ElGamal", nil
		default:
			return "Unknown", nil
		}
	}

	return "", fmt.Errorf("No keys found")
}
