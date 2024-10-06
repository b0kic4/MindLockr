package keys

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
)

// ECDSA -> for ditigal signature
// ECDH -> for generating keys

type PubPrvKeyGen struct{}

type RequestData struct {
	Passphrase string `json:"passphrase"`
}

type ReturnType struct {
	privKey crypto.PrivateKey
	pubKey  crypto.PublicKey
}

func (pubpriv *PubPrvKeyGen) GeneratePrivatePublicKeys(req RequestData) (ReturnType, error) {
	// first we are creating the private key
	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return ReturnType{}, err
	}

	// than from the private key
	// we are getting the public key
	pubKey := privKey.Public()

	return ReturnType{
		privKey: privKey,
		pubKey:  pubKey,
	}, nil
}
