package validation

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/asn1"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"math/big"
)

type ECDSASignature struct {
	R, S *big.Int
}

type Validatior struct{}

func (v *Validatior) VerifyData(data string, sig string, pubKey string) (bool, error) {
	// Hash the data with SHA-256
	encData, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return false, fmt.Errorf("failed to decode data: %v", err)
	}

	hash := sha256.Sum256(encData)

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
	parsedPubKey, err := parsePublicKey(pubKey)
	if err != nil {
		return false, fmt.Errorf("failed to parse public key: %v", err)
	}

	// Verify the signature using ECDSA
	isValid := ecdsa.Verify(parsedPubKey, hash[:], signature.R, signature.S)
	if !isValid {
		return false, nil // Verification failed, but no error in processing
	}

	return true, nil // Verification succeeded
}

// Helper function to parse a PEM-formatted public key
func parsePublicKey(pubKeyPem string) (*ecdsa.PublicKey, error) {
	block, _ := pem.Decode([]byte(pubKeyPem))
	if block == nil || block.Type != "PUBLIC KEY" {
		return nil, fmt.Errorf("failed to decode public key from PEM format")
	}

	pubKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse public key: %v", err)
	}

	pubKey, ok := pubKeyInterface.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("not an ECDSA public key")
	}

	return pubKey, nil
}
