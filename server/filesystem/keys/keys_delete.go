package keys

import (
	"fmt"
	"os"
	"path/filepath"
)

func (kr *KeyRetrieve) DeleteKey(ki KeyInfo) bool {
	folderPath := kr.folderInstance.GetFolderPath()
	keyFilePath := filepath.Join(folderPath, "keys", "symmetric", ki.Algorithm, ki.Name)

	err := os.Remove(keyFilePath)
	if err != nil {
		fmt.Printf("Error deleting key file: %v\n", err)
		return false
	}

	return true
}
