package keys

import (
	"crypto/ecdsa"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"strings"
)

type KeyTypeDetection struct{}

func cleanKeyData(keyData string) string {
	return strings.TrimSpace(keyData)
}

func (kd *KeyTypeDetection) DetectKeyType(keyData string) (string, error) {
	keyData = cleanKeyData(keyData)

	block, _ := pem.Decode([]byte(keyData))
	if block == nil {
		return "", errors.New("failed to decode PEM block")
	}

	switch block.Type {
	case "PGP PUBLIC KEY", "PUBLIC KEY":
		if pubKey, err := x509.ParsePKIXPublicKey(block.Bytes); err == nil {
			switch pubKey.(type) {
			case *rsa.PublicKey:
				return "RSA Public Key (PKIX Format)", nil
			case *ecdsa.PublicKey:
				return "ECC Public Key", nil
			default:
				return "Unknown Public Key Type", nil
			}
		}

		if _, err := x509.ParsePKCS1PublicKey(block.Bytes); err == nil {
			return "RSA Public Key (PKCS1 Format)", nil
		}

		return "", errors.New("failed to parse public key (use ParsePKCS1PublicKey instead for this key format)")

	case "PGP PRIVATE KEY", "PRIVATE KEY", "RSA PRIVATE KEY":
		if _, err := x509.ParseECPrivateKey(block.Bytes); err == nil {
			return "ECC Private Key", nil
		}

		if _, err := x509.ParsePKCS1PrivateKey(block.Bytes); err == nil {
			return "RSA Private Key (PKCS1 Format)", nil
		}

		if privKey, err := x509.ParsePKCS8PrivateKey(block.Bytes); err == nil {
			switch privKey.(type) {
			case *rsa.PrivateKey:
				return "RSA Private Key (PKCS8 Format)", nil
			case *ecdsa.PrivateKey:
				return "ECC Private Key", nil
			}
		}

		return "", errors.New("failed to parse private key")

	default:
		return "", errors.New("unknown key format")
	}
}
