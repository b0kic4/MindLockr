package keys

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"path/filepath"
)

type (
	PgpKeysGen struct{}

	RequestData struct {
		EnType     string
		Usage      string
		Passphrase string
		Bits       int
	}

	ReturnType struct {
		PrivKey string
		PubKey  string
	}
)

func (pgpKeysGen *PgpKeysGen) GeneratePGPKeys(req RequestData) (ReturnType, error) {
	switch req.EnType {
	case "ECC":
		return pgpKeysGen.GenerateEcPgpKeys(req)

	case "RSA":
		if req.Bits < 1024 || req.Bits > 7680 {
			return ReturnType{}, fmt.Errorf("RSA key generation requires a valid bit size (1024 <= x <= 7680)")
		}
		return pgpKeysGen.GenerateRsaPgpKeys(req)

	default:
		return ReturnType{}, fmt.Errorf("unsupported encryption type: %v", req.EnType)
	}
}

func (pgpKeysGen *PgpKeysGen) GenerateEcPgpKeys(req RequestData) (ReturnType, error) {
	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return ReturnType{}, err
	}

	privKeyBytes, err := x509.MarshalECPrivateKey(privKey)
	if err != nil {
		return ReturnType{}, fmt.Errorf("unable to marshal ECDSA private key: %v", err)
	}

	privKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PGP PRIVATE KEY",
		Bytes: privKeyBytes,
	})

	data := symmetricencryption.DataToEncrypt{
		Data:       string(privKeyPEM),
		Passphrase: req.Passphrase,
	}

	encryptedPrivKey, err := symmetricencryption.AES256Encryption(data)
	if err != nil {
		return ReturnType{}, fmt.Errorf("encryption failed: %v", err)
	}

	path := filepath.Join("ECC", req.Usage)
	err = SavePgpPrivKey(encryptedPrivKey, path)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	pubKeyBytes, err := x509.MarshalPKIXPublicKey(&privKey.PublicKey)
	if err != nil {
		return ReturnType{}, fmt.Errorf("unable to marshal ECDSA public key: %v", err)
	}

	pubKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PGP PUBLIC KEY",
		Bytes: pubKeyBytes,
	})

	err = SavePgpPublicKey(pubKeyPEM, path)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: encryptedPrivKey,
		PubKey:  string(pubKeyPEM),
	}, nil
}

func (pgpKeysGen *PgpKeysGen) GenerateRsaPgpKeys(req RequestData) (ReturnType, error) {
	privKey, err := rsa.GenerateKey(rand.Reader, req.Bits)
	if err != nil {
		return ReturnType{}, fmt.Errorf("error generating RSA private key: %v", err)
	}

	privKeyBytes := x509.MarshalPKCS1PrivateKey(privKey)

	privKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PGP PRIVATE KEY",
		Bytes: privKeyBytes,
	})

	data := symmetricencryption.DataToEncrypt{
		Data:       string(privKeyPEM),
		Passphrase: req.Passphrase,
	}

	encryptedPrivKey, err := symmetricencryption.AES256Encryption(data)
	if err != nil {
		return ReturnType{}, fmt.Errorf("encryption of private key failed: %v", err)
	}

	path := filepath.Join("RSA", req.Usage)
	err = SavePgpPrivKey(encryptedPrivKey, path)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	pubKeyBytes := x509.MarshalPKCS1PublicKey(&privKey.PublicKey)
	pubKeyPEM := pem.EncodeToMemory(&pem.Block{
		Type:  "PGP PUBLIC KEY",
		Bytes: pubKeyBytes,
	})

	err = SavePgpPublicKey(pubKeyPEM, path)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: encryptedPrivKey,
		PubKey:  string(pubKeyPEM),
	}, nil
}

func (pgpKeysGen *PgpKeysGen) DecryptPgpPrivKey(passphrase string, keyFolderPath string) (string, error) {
	privKeyPath := filepath.Join(keyFolderPath, "private.pem")

	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	decryptedPrivKeyPEM, err := symmetricdecryption.AES256Decryption(symmetricdecryption.DataToDecrypt{
		EncryptedData: string(encryptedPrivKeyHex),
		Passphrase:    passphrase,
	})
	if err != nil {
		return "", fmt.Errorf("failed to decrypt private key: %v", err)
	}

	return decryptedPrivKeyPEM, nil
}
