package keys

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
)

// ECDSA -> for ditigal signature
// ECDH -> for generating keys

type PubPrvKeyGen struct{}

type RequestData struct {
	Passphrase string `json:"passphrase"`
}

type ReturnType struct {
	PrivKey crypto.PrivateKey
	PubKey  crypto.PublicKey
}

func (pubpriv *PubPrvKeyGen) GeneratePrivatePublicKeys(req RequestData) (ReturnType, error) {
	// Generate the private key
	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return ReturnType{}, err
	}

	// Get the public key from the private key
	pubKey := privKey.Public()

	err = SavePrivateKey(privKey, req.Passphrase)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save private key: %v", err)
	}

	err = SavePublicKey(pubKey)
	if err != nil {
		return ReturnType{}, fmt.Errorf("failed to save public key: %v", err)
	}

	return ReturnType{
		PrivKey: privKey,
		PubKey:  pubKey,
	}, nil
}
