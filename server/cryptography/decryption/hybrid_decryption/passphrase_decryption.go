package hybriddecryption

import (
	"MindLockr/server/cryptography/cryptohelper"
	"MindLockr/server/filesystem/keys"
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdh"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

type HybridPassphraseDecryption struct{}

func (hpd *HybridPassphraseDecryption) DecryptPassphrase(encryptedPassphraseB64 string, privKey string) (string, error) {
	kd := keys.KeyTypeDetection{}
	alg, err := kd.DetectKeyType(privKey)
	if err != nil {
		return "", fmt.Errorf("error ocurred while detecting key type: ", err)
	}

	encPassphrase, err := base64.StdEncoding.DecodeString(encryptedPassphraseB64)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted passphrase: %v", err)
	}

	switch alg {
	case "ECC":
		return decryptWithECC(encPassphrase, privKey)
	case "RSA":
		return decryptWithRSA(encPassphrase, privKey)
	default:
		return "", fmt.Errorf("unsupported key type")
	}
}

func decryptWithECC(encPassphrase []byte, privKeyB64 string) (string, error) {
	privKey, err := cryptohelper.ParseECCPrivateKey(privKeyB64)
	if err != nil {
		return "", fmt.Errorf("failed to parse ECC private key: %v", err)
	}

	curve := ecdh.P256()
	ecdhPrivKey, err := curve.NewPrivateKey(privKey.D.Bytes())
	if err != nil {
		return "", fmt.Errorf("failed to convert ECDSA private key to ECDH: %v", err)
	}

	ephemeralPubKeyLength := int(encPassphrase[0])<<8 + int(encPassphrase[1])
	ephemeralPubKeyBytes := encPassphrase[2 : 2+ephemeralPubKeyLength]
	encryptedPassphrase := encPassphrase[2+ephemeralPubKeyLength:]

	ecdhPubKey, err := curve.NewPublicKey(ephemeralPubKeyBytes)
	if err != nil {
		return "", fmt.Errorf("failed to deserialize ephemeral public key: %v", err)
	}

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

func decryptWithRSA(encPassphrase []byte, privKeyB64 string) (string, error) {
	privKey, err := cryptohelper.ParseRSAPrivateKey(privKeyB64)
	if err != nil {
		return "", fmt.Errorf("failed to parse RSA private key: %v", err)
	}

	decryptedPassphrase, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, privKey, encPassphrase, nil)
	if err != nil {
		return "", fmt.Errorf("RSA decryption failed: %v", err)
	}

	return string(decryptedPassphrase), nil
}
