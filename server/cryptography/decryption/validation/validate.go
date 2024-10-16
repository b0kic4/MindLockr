package validation

import (
	"MindLockr/server/cryptography/cryptohelper"
	"crypto/ecdsa"
	"crypto/sha256"
	"encoding/asn1"
	"encoding/base64"
	"fmt"
	"math/big"
)

type ECDSASignature struct {
	R, S *big.Int
}

type Validator struct{}

func (v *Validator) VerifyData(data string, sig string, pubKey string) (bool, error) {
	hash := sha256.Sum256([]byte(data))

	// Decode the base64-encoded signature
	encSig, err := base64.StdEncoding.DecodeString(sig)
	if err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	// Decode the signature into r and s values
	var signature ECDSASignature
	if _, err := asn1.Unmarshal(encSig, &signature); err != nil {
		return false, fmt.Errorf("failed to decode signature: %v", err)
	}

	// Parse the PEM-encoded public key
	parsedPubKey, err := cryptohelper.ParsePublicKey(pubKey)
	if err != nil {
		return false, fmt.Errorf("failed to parse public key: %v", err)
	}

	// Verify the signature using ECDSA
	isValid := ecdsa.Verify(parsedPubKey, hash[:], signature.R, signature.S)
	if !isValid {
		return false, nil // Verification failed
	}

	return true, nil // Verification succeeded
}
