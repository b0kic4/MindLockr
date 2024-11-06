package pgpget

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"
)

type PgpRetrieve struct {
	folderInstance *filesystem.Folder
}

func NewPgpRetrieve(folder *filesystem.Folder) *PgpRetrieve {
	return &PgpRetrieve{
		folderInstance: folder,
	}
}

type PgpKeyInfo struct {
	Name       string `json:"name"`
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
	FolderPath string `json:"folderPath"`
	Type       string `json:"type"`
}

func (kr *PgpRetrieve) RetrievePgpKeys() ([]PgpKeyInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()

	eccBaseFolderPath := filepath.Join(folderPath, "pgp", "ECC")
	rsaBaseFolderPath := filepath.Join(folderPath, "pgp", "RSA")

	eccKeys := []PgpKeyInfo{}
	rsaKeys := []PgpKeyInfo{}
	var err error

	// Pass the key type "ECC" when retrieving ECC keys
	eccKeys, err = kr.getPgpKeysFromDirectory(eccBaseFolderPath, "ECC")
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error retrieving ECC PGP keys: %v", err)
	}

	// Pass the key type "RSA" when retrieving RSA keys
	rsaKeys, err = kr.getPgpKeysFromDirectory(rsaBaseFolderPath, "RSA")
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error retrieving RSA PGP keys: %v", err)
	}

	return append(eccKeys, rsaKeys...), nil
}

func (kr *PgpRetrieve) getPgpKeysFromDirectory(basePath string, keyType string) ([]PgpKeyInfo, error) {
	pgpKeys := []PgpKeyInfo{}

	if _, err := os.Stat(basePath); os.IsNotExist(err) {
		return pgpKeys, nil
	}

	keyFolders, err := os.ReadDir(basePath)
	if err != nil {
		return []PgpKeyInfo{}, fmt.Errorf("Error reading PGP keys folder: %v", err)
	}

	for _, keyFolder := range keyFolders {
		if keyFolder.IsDir() {
			keyName := keyFolder.Name()
			keyFolderPath := filepath.Join(basePath, keyName)

			pgpKeys = append(pgpKeys, PgpKeyInfo{
				Name:       keyName,
				FolderPath: keyFolderPath,
				Type:       keyType,
			})
		}
	}

	return pgpKeys, nil
}

func (kr *PgpRetrieve) RetrievePgpPubKey(keyFolderPath string) (string, error) {
	pubKeyPath := filepath.Join(keyFolderPath, "public.asc")

	pubKeyPEM, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read public key file: %v", err)
	}

	return string(pubKeyPEM), nil
}

func (kr *PgpRetrieve) RetrievePgpPrivKey(keyFolderPath string) (string, error) {
	privKeyPath := filepath.Join(keyFolderPath, "private.asc")

	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	return string(encryptedPrivKeyHex), nil
}
