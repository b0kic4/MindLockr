package pgpfs

import (
	"MindLockr/server/cryptography/cryptohelper"
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
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
	folderPath := filepath.Join(kr.folderInstance.GetFolderPath(), "pgp")
	return kr.getPgpKeysFromDirectory(folderPath)
}

func (kr *PgpRetrieve) getPgpKeysFromDirectory(basePath string) ([]PgpKeyInfo, error) {
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

			pubKeyArmor, err := kr.RetrievePgpPubKey(keyFolderPath)
			if err != nil {
				return nil, fmt.Errorf("Failed to get public key in getPgpKeysFromDirectory: %s", err)
			}

			loadedPubKey, err := crypto.NewKeyFromArmored(pubKeyArmor)
			if err != nil {
				return nil, fmt.Errorf("Failed to load public key %v", err)
			}

			alg := loadedPubKey.GetEntity().PrimaryKey.PubKeyAlgo
			stringAlg, err := cryptohelper.DetectPGPType(alg)
			if err != nil {
				return nil, fmt.Errorf("Failed to detect PGP type %v", err)
			}

			pgpKeys = append(pgpKeys, PgpKeyInfo{
				Name:       keyName,
				PublicKey:  pubKeyArmor,
				FolderPath: keyFolderPath,
				Type:       stringAlg,
			})
		}
	}

	return pgpKeys, nil
}

func (kr *PgpRetrieve) RetrievePgpPubKey(keyFolderPath string) (string, error) {
	pubKeyPath := filepath.Join(keyFolderPath, "public.asc")

	pubKeyArmor, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read public key file: %v", err)
	}

	return string(pubKeyArmor), nil
}

func (kr *PgpRetrieve) RetrievePgpPrivKey(keyFolderPath string) (string, error) {
	privKeyPath := filepath.Join(keyFolderPath, "private.asc")

	encryptedPrivKeyHex, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	return string(encryptedPrivKeyHex), nil
}

func (kr *PgpRetrieve) RetrievePgpFingerprint(keyFolderPath string) (string, error) {
	pubKeyPath := filepath.Join(keyFolderPath, "private.asc")

	pubKeyArmor, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	loadedPubKey, err := crypto.NewKeyFromArmored(string(pubKeyArmor))
	if err != nil {
		return "", fmt.Errorf("failed to load public key %v", err)
	}

	fingerprint := loadedPubKey.GetFingerprint()

	return string(fingerprint), nil
}

func (kr *PgpRetrieve) RetrieveKeyMoreInfo(keyFolderPath string) (map[string]string, error) {
	pubKeyPath := filepath.Join(keyFolderPath, "public.asc")
	pubKeyArmor, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read public key file: %v", err)
	}

	loadedKey, err := crypto.NewKeyFromArmored(string(pubKeyArmor))
	if err != nil {
		return nil, fmt.Errorf("failed to load public key %v", err)
	}

	moreInfo := make(map[string]string)
	identities := loadedKey.GetEntity().Identities
	for _, identity := range identities {
		moreInfo["User Name"] = identity.Name
		moreInfo["Email"] = identity.UserId.Email
		break
	}

	moreInfo["Fingerprint"] = loadedKey.GetFingerprint()

	alg := loadedKey.GetEntity().PrimaryKey.PubKeyAlgo
	stringAlg, err := cryptohelper.DetectPGPType(alg)
	if err == nil {
		moreInfo["Key Type"] = stringAlg
	} else {
		moreInfo["Key Type"] = "Unknown"
	}

	moreInfo["Owner Trust"] = "N/A"
	moreInfo["Key Validity"] = "Fully Valid"

	return moreInfo, nil
}
