package keys

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"MindLockr/server/filesystem"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"path/filepath"
)

type PubPrvKeyGen struct{}

// i need to add in here the
// some kind of name for what
// pub and priv keys are being used

type RequestData struct {
	Usage      string
	Passphrase string
}

type ReturnType struct {
	PrivKey string
	PubKey  string
}

// 1. Encode the private key to PEM format
// 2. Encrypt the private key PEM
// 3. Save the encrypted private key
// 4. Encode the public key to PEM format
// 5. Save the public PEM format key
// 6. return the values

func (pubpriv *PubPrvKeyGen) GeneratePrivatePublicKeys(req RequestData) (ReturnType, error) {
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

	err = SavePrivateKey(encryptedPrivKey, req.Usage)
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

	err = SavePublicKey(pubKeyPEM, req.Usage)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: encryptedPrivKey,
		PubKey:  string(pubKeyPEM),
	}, nil
}

func GetPgpKeys() {
}

// this function should recieve the path of the
// which pgp key we are retrieving
func (pubpriv *PubPrvKeyGen) RetrievePubKey(keyName string) (string, error) {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()
	keysDir := filepath.Join(folderPath, "priv-pub", keyName)
	pubKeyPath := filepath.Join(keysDir, "public.pem")

	// Read the public key file
	pubKeyPEM, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read public key file: %v", err)
	}

	return string(pubKeyPEM), nil
}

// this function should recieve the path of the
// which pgp key we are retrieving
func (pubpriv *PubPrvKeyGen) RetrievePrivKey(keyName string) (string, error) {
	folderInstance := filesystem.GetFolderInstance()
	keysDir := filepath.Join(folderInstance.GetFolderPath(), "priv-pub", keyName)
	privKeyPath := filepath.Join(keysDir, "private.pem")

	// Read the encrypted private key file
	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	return string(encryptedPrivKeyHex), nil
}

// this function should recieve the path of the
// which pgp key we are retrieving
func (pubpriv *PubPrvKeyGen) DecryptPrivKey(passphrase string, keyName string) (string, error) {
	folderInstance := filesystem.GetFolderInstance()
	folderPath := folderInstance.GetFolderPath()
	keysDir := filepath.Join(folderPath, "priv-pub", keyName)
	privKeyPath := filepath.Join(keysDir, "private.pem")

	// Read the encrypted private key file
	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	// Decrypt the private key using the passphrase
	decryptedPrivKeyPEM, err := symmetricdecryption.AES256Decryption(symmetricdecryption.DataToDecrypt{
		EncryptedData: string(encryptedPrivKeyHex),
		Passphrase:    passphrase,
	})
	if err != nil {
		return "", fmt.Errorf("failed to decrypt private key: %v", err)
	}

	return decryptedPrivKeyPEM, nil
}
