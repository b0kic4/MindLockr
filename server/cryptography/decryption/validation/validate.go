package validation

import (
	"MindLockr/server/cryptography/cryptohelper"
	"crypto"
	"crypto/ecdsa"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/asn1"
	"encoding/base64"
	"errors"
	"fmt"
	"math/big"
)

type ECDSASignature struct {
	R, S *big.Int
}

type Validator struct{}

func (v *Validator) VerifyData(data, sig, pubKey, pgpType string) (bool, error) {
	switch pgpType {
	case "ECC":
		return verifyWithECC(data, sig, pubKey)
	case "RSA":
		return verifyWithRSA(data, sig, pubKey)
	default:
		return false, errors.New("unsupported key type")
	}
}

func verifyWithECC(data string, sig string, pubKey string) (bool, error) {
	hash := sha256.Sum256([]byte(data))

	// Decode the base64-encoded signature
	encSig, err := base64.StdEncoding.DecodeString(sig)
	if err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	var signature ECDSASignature
	if _, err := asn1.Unmarshal(encSig, &signature); err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	parsedPubKey, err := cryptohelper.ParseECCPublicKey(pubKey)
	if err != nil {
		return false, fmt.Errorf("failed to parse ECC public key: %v", err)
	}

	// Verify the signature using ECDSA
	isValid := ecdsa.Verify(parsedPubKey, hash[:], signature.R, signature.S)
	if !isValid {
		return false, nil
	}

	return true, nil
}

func verifyWithRSA(data string, sig string, pubKey string) (bool, error) {
	hash := sha256.Sum256([]byte(data))

	encSig, err := base64.StdEncoding.DecodeString(sig)
	if err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	parsedPubKey, err := cryptohelper.ParseRSAPublicKey(pubKey)
	if err != nil {
		return false, fmt.Errorf("failed to parse RSA public key: %v", err)
	}

	err = rsa.VerifyPKCS1v15(parsedPubKey, crypto.SHA256, hash[:], encSig)
	if err != nil {
		return false, fmt.Errorf("RSA signature verification failed: %v", err)
	}

	return true, nil
}
