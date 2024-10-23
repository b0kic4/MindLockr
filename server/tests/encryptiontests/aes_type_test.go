package symmetricecnryptiontests

import (
	"MindLockr/server/cryptography/cryptohelper"
	"fmt"
	"path/filepath"
	"testing"
)

func TestAesType(t *testing.T) {
	keyFilePath := filepath.Join("/Users/boris/Desktop/Wails-Encryption", "keys", "symmetric", "AES-256", "Encrypted.key")

	algorithmType, err := cryptohelper.DetectAESType(keyFilePath)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Println("alg Type: ", algorithmType)
}
