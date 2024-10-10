package hybriddecryption

import (
	hybridencryption "MindLockr/server/cryptography/encryption/hybrid_encryption"
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdh"
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

	// Convert ECDSA private key to ECDH private key
	curve := ecdh.P256()
	ecdhPrivKey, err := curve.NewPrivateKey(privKey.D.Bytes())
	if err != nil {
		return "", fmt.Errorf("failed to convert ECDSA private key to ECDH: %v", err)
	}

	// Extract ephemeral public key and encrypted passphrase
	ephemeralPubKeyLength := int(encPassphrase[0])<<8 + int(encPassphrase[1])
	ephemeralPubKeyBytes := encPassphrase[2 : 2+ephemeralPubKeyLength]
	encryptedPassphrase := encPassphrase[2+ephemeralPubKeyLength:]

	// Deserialize the ephemeral public key
	ecdhPubKey, err := curve.NewPublicKey(ephemeralPubKeyBytes)
	if err != nil {
		return "", fmt.Errorf("failed to deserialize ephemeral public key: %v", err)
	}

	// Derive the shared secret
	sharedSecret, err := ecdhPrivKey.ECDH(ecdhPubKey)
	if err != nil {
		return "", fmt.Errorf("failed to derive shared secret: %v", err)
	}

	// Create AES-GCM cipher with the derived shared secret
	key := sha256.Sum256(sharedSecret)
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return "", fmt.Errorf("failed to create AES cipher: %v", err)
	}
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("failed to create AES-GCM: %v", err)
	}

	// Decrypt the passphrase
	nonceSize := aesGCM.NonceSize()
	nonce, ciphertext := encryptedPassphrase[:nonceSize], encryptedPassphrase[nonceSize:]
	passphrase, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt passphrase: %v", err)
	}

	return string(passphrase), nil
}
