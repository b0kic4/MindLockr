package hybriddecryption

import (
	hybridencryption "MindLockr/server/cryptography/encryption/hybrid_encryption"
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

type HybridPassphraseDecryption struct{}

func (hpd *HybridPassphraseDecryption) DecryptPassphrase(encryptedPassphraseB64 string, privKeyB64 string) (string, error) {
	// Decode the base64-encoded encrypted passphrase
	encPassphrase, err := base64.StdEncoding.DecodeString(encryptedPassphraseB64)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted passphrase: %v", err)
	}

	// Parse the private key
	privKey, err := hybridencryption.ParsePrivateKey(privKeyB64)
	if err != nil {
		return "", fmt.Errorf("failed to parse private key: %v", err)
	}

	// Extract ephemeral public key length
	ephemeralPubKeyLength := int(encPassphrase[0])<<8 + int(encPassphrase[1])
	ephemeralPubKeyBytes := encPassphrase[2 : 2+ephemeralPubKeyLength]
	encryptedPassphrase := encPassphrase[2+ephemeralPubKeyLength:]

	// Unmarshal the ephemeral public key
	x, y := elliptic.Unmarshal(privKey.Curve, ephemeralPubKeyBytes)
	if x == nil || y == nil {
		return "", fmt.Errorf("failed to unmarshal ephemeral public key")
	}
	ephemeralPubKey := &ecdsa.PublicKey{Curve: privKey.Curve, X: x, Y: y}

	// Derive the shared secret using ECDH
	sharedSecretX, _ := privKey.Curve.ScalarMult(ephemeralPubKey.X, ephemeralPubKey.Y, privKey.D.Bytes())
	sharedSecret := sha256.Sum256(sharedSecretX.Bytes())

	// Decrypt the AES-GCM encrypted passphrase
	block, err := aes.NewCipher(sharedSecret[:])
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to create AES-GCM: %v", err)
	}

	// Extract nonce and ciphertext for the encrypted passphrase
	nonceSize := aesGCM.NonceSize()
	nonce, ciphertext := encryptedPassphrase[:nonceSize], encryptedPassphrase[nonceSize:]

	// Decrypt the passphrase
	passphrase, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt passphrase: %v", err)
	}

	return string(passphrase), nil
}
