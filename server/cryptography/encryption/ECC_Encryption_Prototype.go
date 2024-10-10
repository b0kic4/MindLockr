package encryption

import (
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"crypto/ecdsa"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"

	ecies "github.com/ecies/go/v2"
)

type AsymmetricKeyEncryption struct{}

type RequestData struct {
	Data          string `json:"data"`
	Passphrase    string `json:"passphrase"`
	Algorithm     string `json:"algorithm"`
	AlgorithmType string `json:"algorithmType"`
	FolderName    string `json:"folderName"`
	PubKey        string `json:"pubKey"`
	PrivKey       string `json:"privKey"`
}

type EncryptionResult struct {
	EncryptedData       string `json:"encryptedData"`
	EncryptedPassphrase string `json:"encryptedPassphrase"`
	SignatureR          string `json:"signatureR"`
	SignatureS          string `json:"signatureS"`
	SenderPublicKey     string `json:"senderPublicKey"`
}

func (ake *AsymmetricKeyEncryption) EncryptSharedData(req RequestData) (*EncryptionResult, error) {
	// Step 1: Encrypt data with AES
	aes := &symmetricencryption.Cryptography{}

	aesData := symmetricencryption.RequestData{
		Data:          req.Data,
		Passphrase:    req.Passphrase,
		Algorithm:     req.Algorithm,
		AlgorithmType: req.AlgorithmType,
	}

	aesRes, err := aes.EncryptAES(aesData)
	if err != nil {
		return nil, fmt.Errorf("error occurred when encrypting the data: %v", err)
	}

	// Decode the base64-encoded encrypted data to get the byte slice
	encryptedDataBytes, err := base64.StdEncoding.DecodeString(aesRes)
	if err != nil {
		return nil, fmt.Errorf("failed to decode encrypted data: %v", err)
	}

	// Step 2: Encrypt the passphrase with the recipient's public key
	// Parse the recipient's public key from PEM format
	recipientECDSAPubKey, err := parsePublicKey(req.PubKey)
	if err != nil {
		return nil, fmt.Errorf("failed to parse recipient's public key: %v", err)
	}

	// Manually construct the uncompressed public key bytes
	uncompressedPubKeyBytes := uncompressedPublicKeyBytes(recipientECDSAPubKey)

	// Create *ecies.PublicKey using NewPublicKeyFromBytes
	recipientECIESPubKey, err := ecies.NewPublicKeyFromBytes(uncompressedPubKeyBytes)
	if err != nil {
		return nil, fmt.Errorf("failed to create ECIES public key: %v", err)
	}

	// Encrypt the passphrase
	encryptedPassphraseBytes, err := ecies.Encrypt(recipientECIESPubKey, []byte(req.Passphrase))
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt passphrase: %v", err)
	}

	// Step 3: Sign the encrypted data using your ECDSA private key
	// Parse your private key from PEM format
	senderECDSAPrivKey, err := parsePrivateKey(req.PrivKey)
	if err != nil {
		return nil, fmt.Errorf("failed to parse sender's private key: %v", err)
	}

	// Hash the encrypted data
	hash := sha256.Sum256(encryptedDataBytes)

	// Sign the hash
	r, s, err := ecdsa.Sign(rand.Reader, senderECDSAPrivKey, hash[:])
	if err != nil {
		return nil, fmt.Errorf("failed to sign data: %v", err)
	}

	// Encode signature components as hex strings
	signatureR := fmt.Sprintf("%x", r)
	signatureS := fmt.Sprintf("%x", s)

	// Get sender's public key in PEM format
	senderPubKeyPEM, err := encodePublicKeyToPEM(&senderECDSAPrivKey.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("failed to encode sender's public key: %v", err)
	}

	// Prepare the result
	result := &EncryptionResult{
		EncryptedData:       aesRes,
		EncryptedPassphrase: base64.StdEncoding.EncodeToString(encryptedPassphraseBytes),
		SignatureR:          signatureR,
		SignatureS:          signatureS,
		SenderPublicKey:     senderPubKeyPEM,
	}

	return result, nil
}

// Helper function to manually construct uncompressed public key bytes
func uncompressedPublicKeyBytes(pubKey *ecdsa.PublicKey) []byte {
	byteLen := (pubKey.Params().BitSize + 7) / 8
	pubKeyBytes := make([]byte, 1+2*byteLen)
	pubKeyBytes[0] = 0x04 // Uncompressed point indicator

	xBytes := pubKey.X.Bytes()
	yBytes := pubKey.Y.Bytes()

	copy(pubKeyBytes[1+(byteLen-len(xBytes)):1+byteLen], xBytes)
	copy(pubKeyBytes[1+byteLen+(byteLen-len(yBytes)):], yBytes)

	return pubKeyBytes
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

// Helper function to parse a PEM-formatted private key
func parsePrivateKey(privKeyPem string) (*ecdsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(privKeyPem))
	if block == nil || block.Type != "EC PRIVATE KEY" {
		return nil, fmt.Errorf("failed to decode private key from PEM format")
	}

	privKey, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse private key: %v", err)
	}

	return privKey, nil
}

// Helper function to encode ECDSA public key to PEM format
func encodePublicKeyToPEM(pubKey *ecdsa.PublicKey) (string, error) {
	pubKeyBytes, err := x509.MarshalPKIXPublicKey(pubKey)
	if err != nil {
		return "", fmt.Errorf("unable to marshal ECDSA public key: %v", err)
	}

	pubKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: pubKeyBytes,
	})

	return string(pubKeyPEM), nil
}
