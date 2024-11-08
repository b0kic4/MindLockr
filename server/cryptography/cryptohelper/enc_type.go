package cryptohelper

import (
	"fmt"

	"github.com/ProtonMail/go-crypto/openpgp/packet"
)

type PublicKeyAlgorithm int

const (
	PubKeyAlgoRSA              PublicKeyAlgorithm = 1
	PubKeyAlgoElGamal          PublicKeyAlgorithm = 16
	PubKeyAlgoDSA              PublicKeyAlgorithm = 17
	PubKeyAlgoECDH             PublicKeyAlgorithm = 18
	PubKeyAlgoECDSA            PublicKeyAlgorithm = 19
	PubKeyAlgoEdDSA            PublicKeyAlgorithm = 22
	PubKeyAlgoX25519           PublicKeyAlgorithm = 25
	PubKeyAlgoX448             PublicKeyAlgorithm = 26
	PubKeyAlgoEd25519          PublicKeyAlgorithm = 27
	PubKeyAlgoEd448            PublicKeyAlgorithm = 28
	ExperimentalPubKeyAlgoAEAD PublicKeyAlgorithm = 100
	ExperimentalPubKeyAlgoHMAC PublicKeyAlgorithm = 101
	PubKeyAlgoRSAEncryptOnly   PublicKeyAlgorithm = 2
	PubKeyAlgoRSASignOnly      PublicKeyAlgorithm = 3
)

// DetectPGPType returns the name of the PGP public key algorithm based on its numeric identifier.
func DetectPGPType(num packet.PublicKeyAlgorithm) (string, error) {
	switch PublicKeyAlgorithm(num) {
	case PubKeyAlgoRSA:
		return "RSA", nil
	case PubKeyAlgoElGamal:
		return "ElGamal", nil
	case PubKeyAlgoDSA:
		return "DSA", nil
	case PubKeyAlgoECDH:
		return "ECDH", nil
	case PubKeyAlgoECDSA:
		return "ECDSA", nil
	case PubKeyAlgoEdDSA:
		return "EdDSA", nil
	case PubKeyAlgoX25519:
		return "X25519", nil
	case PubKeyAlgoX448:
		return "X448", nil
	case PubKeyAlgoEd25519:
		return "Ed25519", nil
	case PubKeyAlgoEd448:
		return "Ed448", nil
	case ExperimentalPubKeyAlgoAEAD:
		return "Experimental AEAD", nil
	case ExperimentalPubKeyAlgoHMAC:
		return "Experimental HMAC", nil
	case PubKeyAlgoRSAEncryptOnly:
		return "RSA (Encrypt Only - Deprecated)", nil
	case PubKeyAlgoRSASignOnly:
		return "RSA (Sign Only - Deprecated)", nil
	default:
		return "", fmt.Errorf("unknown PGP algorithm with identifier %d", num)
	}
}
