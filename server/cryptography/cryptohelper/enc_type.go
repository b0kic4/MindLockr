package cryptohelper

import (
	"fmt"
	"os"
)

func GetAESType(keyFilePath string) (string, error) {
	keyData, err := os.ReadFile(keyFilePath)
	if err != nil {
		return "", fmt.Errorf("Error reading key file %s: %v", keyFilePath, err)
	}

	keyLength := len(keyData)

	var algorithm string
	switch keyLength {
	case 16:
		algorithm = "AES-128"
	case 24:
		algorithm = "AES-192"
	case 32:
		algorithm = "AES-256"
	default:
		return "", fmt.Errorf("Unknown key length %d bytes in file %s", keyLength, keyFilePath)
	}

	return algorithm, nil
}
