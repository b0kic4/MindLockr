package en

import (
	"MindLockr/server/filesystem"
	"fmt"
	"os"
	"path/filepath"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type EnRetrieve struct {
	folderInstance *filesystem.Folder
}

func NewEnRetrieve(folder *filesystem.Folder) *EnRetrieve {
	return &EnRetrieve{
		folderInstance: folder,
	}
}

type FileInfo struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Path string `json:"path"`
}

type FolderInfo struct {
	Name  string     `json:"name"`
	Path  string     `json:"path"`
	Type  string     `json:"type"`
	Files []FileInfo `json:"files"`
}

type KeyInfo struct {
	Name      string `json:"name"`
	Algorithm string `json:"algorithm"`
}

type PgpKeyInfo struct {
	Name       string `json:"name"`
	PublicKey  string `json:"publicKey"`
	PrivateKey string `json:"privateKey"`
	FolderPath string `json:"folderPath"`
	Type       string `json:"type"`
}

func (kr *EnRetrieve) LoadEncryptedContent(keyName string) (string, error) {
	folderPath := kr.folderInstance.GetFolderPath()
	keyFilePath := filepath.Join(folderPath, "sym_lockr/", keyName)

	content, err := os.ReadFile(keyFilePath)
	if err != nil {
		return "", fmt.Errorf("failed to read key file: %v", err)
	}

	return string(content), nil
}

func (kr *EnRetrieve) LoadAsymEnData(dataFilePath string) (string, error) {
	dataPath := filepath.Join(dataFilePath)

	content, err := os.ReadFile(dataPath)
	if err != nil {
		return "", fmt.Errorf("Error ocurred when reading content from file path: %v", err)
	}

	return string(content), nil
}

func (kr *EnRetrieve) RetrieveSymEn() ([]KeyInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()

	keysBaseFolderPath := filepath.Join(folderPath, "sym_lockr")

	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("Keys folder does not exist at: %s", keysBaseFolderPath)
	}

	var keyFiles []KeyInfo

	files, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading keys folder: %v", err)
	}

	for _, file := range files {
		if !file.IsDir() && file.Name() != ".DS_Store" {
			keyFiles = append(keyFiles, KeyInfo{
				Name:      file.Name(),
				Algorithm: "AES-256",
			})
		}
	}

	return keyFiles, nil
}

func (kr *EnRetrieve) RetrieveAsymEn() ([]FileInfo, error) {
	folderPath := kr.folderInstance.GetFolderPath()
	keysBaseFolderPath := filepath.Join(folderPath, "hyb_lockr")

	if _, err := os.Stat(keysBaseFolderPath); os.IsNotExist(err) {
		return []FileInfo{}, nil
	}

	var files []FileInfo
	fileEntries, err := os.ReadDir(keysBaseFolderPath)
	if err != nil {
		return nil, fmt.Errorf("Error reading files in asymmetric folder: %v", err)
	}

	for _, fileEntry := range fileEntries {
		if fileEntry.IsDir() {
			continue
		}

		if filepath.Ext(fileEntry.Name()) != ".asc" {
			continue
		}

		files = append(files, FileInfo{
			Name: fileEntry.Name(),
			Type: "Encrypted PGP MSG",
			Path: filepath.Join(keysBaseFolderPath, fileEntry.Name()),
		})
	}

	return files, nil
}

func (kr *EnRetrieve) RetrievePGPMsgInfo(path string) (map[string]string, error) {
	msgPath := filepath.Join(path)

	msgArmor, err := os.ReadFile(msgPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read message file: %v", err)
	}

	pgpMsg, err := crypto.NewPGPMessageFromArmored(string(msgArmor))
	if err != nil {
		return nil, fmt.Errorf("failed to load the pgp msg from armor: %s", err)
	}

	msgInfo := make(map[string]string)

	msgInfo["armor"] = string(msgArmor)

	if pgpMsg.DetachedSignature != nil {
		msgInfo["signature"] = string(pgpMsg.DetachedSignature)
	}
	numOfPackets, err := pgpMsg.GetNumberOfKeyPackets()
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve number of packets: %s", err)
	}
	msgInfo["packets"] = fmt.Sprintf("%d", numOfPackets)

	encryptionKeys, ok := pgpMsg.HexEncryptionKeyIDs()
	if ok {
		if len(encryptionKeys) > 0 {
			msgInfo["encryptionKeyIDs"] = fmt.Sprintf("%v", encryptionKeys)
		}
	}

	signatureKeys, ok := pgpMsg.HexSignatureKeyIDs()
	if ok {
		if len(signatureKeys) > 0 {
			msgInfo["signatureKeyIDs"] = fmt.Sprintf("%v", signatureKeys)
		}
	}

	return msgInfo, nil
}
