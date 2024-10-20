package hybridencryption

import (
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"MindLockr/server/filesystem/keys"
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/asn1"
	"encoding/base64"
	"fmt"
	"io"
	"math/big"
)

type HybridEncryption struct{}

type RequestData struct {
	Data          string `json:"data"`
	Passphrase    string `json:"passphrase"`
	Algorithm     string `json:"algorithm,omitempty"`
	AlgorithmType string `json:"algorithmType,omitempty"`
	FolderName    string `json:"folderName"`
	PubKey        string `json:"pubKey"`
	PrivKey       string `json:"privKey"`
}

type ResponseData struct {
	SymmetricData       string
	EncryptedPassphrase string
	Signature           string
}

type SaveAsymmetricDataRequest struct {
	SymmetricData       string
	AlgSymEnc           string
	EncryptedPassphrase string
	Signature           string
	FolderName          string
}

func (he *HybridEncryption) EncryptSharedData(req RequestData) (ResponseData, error) {
	pubKey, err := ParsePublicKey(req.PubKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to parse public key: %v", err)
	}
	privKey, err := ParsePrivateKey(req.PrivKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to parse private key: %v", err)
	}

	aes := &symmetricencryption.Cryptography{}
	aesEncryptData := symmetricencryption.RequestData{
		Passphrase:    req.Passphrase,
		Data:          req.Data,
		Algorithm:     req.Algorithm,
		AlgorithmType: req.AlgorithmType,
	}
	aesRes, err := aes.EncryptAES(aesEncryptData)
	if err != nil {
		return ResponseData{}, fmt.Errorf("Encryption Failed: %v", err)
	}

	// Encrypt the AES passphrase with the recipient's public key
	encPassphrase, err := encryptWithPublicKey([]byte(req.Passphrase), pubKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to encrypt passphrase: %v", err)
	}
	encPassphraseB64 := base64.StdEncoding.EncodeToString(encPassphrase)

	// Sign the encrypted data
	signature, err := signData([]byte(aesRes), privKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to sign data: %v", err)
	}
	signatureB64 := base64.StdEncoding.EncodeToString(signature)

	keyStore := &keys.KeyStore{}

	saveData := SaveAsymmetricDataRequest{
		SymmetricData:       aesRes,
		AlgSymEnc:           req.AlgorithmType,
		EncryptedPassphrase: encPassphraseB64,
		Signature:           signatureB64,
		FolderName:          req.FolderName,
	}

	err = keyStore.SaveAsymmetricData(keys.HybridRequestData{
		SymmetricData:       saveData.SymmetricData,
		AlgSymEnc:           saveData.AlgSymEnc,
		EncyrptedPassphrase: saveData.EncryptedPassphrase,
		Signature:           saveData.Signature,
		FolderName:          saveData.FolderName,
	})
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to save asymmetric data: %v", err)
	}

	return ResponseData{
		SymmetricData:       aesRes,
		EncryptedPassphrase: encPassphraseB64,
		Signature:           signatureB64,
	}, nil
}

func (he *HybridEncryption) PerformHybridEnOnExistingData(req RequestData) (ResponseData, error) {
	pubKey, err := ParsePublicKey(req.PubKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to parse public key: %v", err)
	}
	privKey, err := ParsePrivateKey(req.PrivKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to parse private key: %v", err)
	}

	// Encrypt the AES passphrase with the recipient's public key
	encPassphrase, err := encryptWithPublicKey([]byte(req.Passphrase), pubKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to encrypt passphrase: %v", err)
	}
	encPassphraseB64 := base64.StdEncoding.EncodeToString(encPassphrase)

	// Sign the encrypted data
	signature, err := signData([]byte(req.Data), privKey)
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to sign data: %v", err)
	}
	signatureB64 := base64.StdEncoding.EncodeToString(signature)

	keyStore := &keys.KeyStore{}

	saveData := SaveAsymmetricDataRequest{
		SymmetricData:       req.Data,
		AlgSymEnc:           req.AlgorithmType,
		EncryptedPassphrase: encPassphraseB64,
		Signature:           signatureB64,
		FolderName:          req.FolderName,
	}

	err = keyStore.SaveAsymmetricData(keys.HybridRequestData{
		SymmetricData:       saveData.SymmetricData,
		AlgSymEnc:           saveData.AlgSymEnc,
		EncyrptedPassphrase: saveData.EncryptedPassphrase,
		Signature:           saveData.Signature,
		FolderName:          saveData.FolderName,
	})
	if err != nil {
		return ResponseData{}, fmt.Errorf("failed to save asymmetric data: %v", err)
	}

	return ResponseData{
		SymmetricData:       req.Data,
		EncryptedPassphrase: encPassphraseB64,
		Signature:           signatureB64,
	}, nil
}

func ParsePublicKey(pubKey string) (*ecdsa.PublicKey, error) {
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

func ParsePrivateKey(privKey string) (*ecdsa.PrivateKey, error) {
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

// link for explanation:
// https://crypto.stackexchange.com/questions/30282/public-key-encryption-using-ecdhe-and-aes-gcm
//
// Encrypts data using the recipient's public key (ECDH + AES-GCM hybrid encryption)
func encryptWithPublicKey(data []byte, pubKey *ecdsa.PublicKey) ([]byte, error) {
	ephemeralPrivKey, err := ecdsa.GenerateKey(pubKey.Curve, rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("failed to generate ephemeral key pair: %v", err)
	}
	sharedSecretX, _ := pubKey.ScalarMult(pubKey.X, pubKey.Y, ephemeralPrivKey.D.Bytes())
	sharedSecret := sha256.Sum256(sharedSecretX.Bytes())

	block, err := aes.NewCipher(sharedSecret[:])
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %v", err)
	}
	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES-GCM: %v", err)
	}
	nonce := make([]byte, aesGCM.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, fmt.Errorf("failed to generate nonce: %v", err)
	}
	encryptedData := aesGCM.Seal(nonce, nonce, data, nil)
	ephemeralPubKey := elliptic.Marshal(pubKey.Curve, ephemeralPrivKey.X, ephemeralPrivKey.Y)

	var buf bytes.Buffer
	buf.Write([]byte{byte(len(ephemeralPubKey) >> 8), byte(len(ephemeralPubKey) & 0xff)})
	buf.Write(ephemeralPubKey)
	buf.Write(encryptedData)
	return buf.Bytes(), nil
}

type ECDSASignature struct {
	R, S *big.Int
}

func signData(data []byte, privKey *ecdsa.PrivateKey) ([]byte, error) {
	hash := sha256.Sum256(data)
	r, s, err := ecdsa.Sign(rand.Reader, privKey, hash[:])
	if err != nil {
		return nil, fmt.Errorf("failed to sign data: %v", err)
	}

	// Encode r and s as ASN.1 DER
	sig, err := asn1.Marshal(ECDSASignature{R: r, S: s})
	if err != nil {
		return nil, fmt.Errorf("failed to encode signature: %v", err)
	}
	return sig, nil
}
