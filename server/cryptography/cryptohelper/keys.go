package cryptohelper

import (
	"crypto/ecdsa"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"fmt"
)

// ECC
func ParseECCPublicKey(pubKey string) (*ecdsa.PublicKey, error) {
	pubKeyBytes, err := base64.StdEncoding.DecodeString(pubKey)
	if err != nil {
		return nil, fmt.Errorf("error decoding public key: %v", err)
	}
	publicKeyInterface, err := x509.ParsePKIXPublicKey(pubKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("error parsing public key: %v", err)
	}
	ecdsaPubKey, ok := publicKeyInterface.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("not an ECDSA public key")
	}
	return ecdsaPubKey, nil
}

func ParseECCPrivateKey(privKey string) (*ecdsa.PrivateKey, error) {
	privKeyBytes, err := base64.StdEncoding.DecodeString(privKey)
	if err != nil {
		return nil, fmt.Errorf("error decoding private key: %v", err)
	}
	ecdsaPrivKey, err := x509.ParseECPrivateKey(privKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("error parsing private key: %v", err)
	}
	return ecdsaPrivKey, nil
}

// RSA
func ParseRSAPublicKey(pubKey string) (*rsa.PublicKey, error) {
	pubKeyBytes, err := base64.StdEncoding.DecodeString(pubKey)
	if err != nil {
		return nil, fmt.Errorf("error decoding public key: %v", err)
	}
	rsaPubKey, err := x509.ParsePKCS1PublicKey(pubKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("error parsing rsa public key: %v", err)
	}

	return rsaPubKey, nil
}

func ParseRSAPrivateKey(privKey string) (*rsa.PrivateKey, error) {
	privKeyBytes, err := base64.StdEncoding.DecodeString(privKey)
	if err != nil {
		return nil, fmt.Errorf("error decoding private key: %v", err)
	}
	rsaPrivKey, err := x509.ParsePKCS1PrivateKey(privKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("error parsing private key: %v", err)
	}
	return rsaPrivKey, nil
}
