package cryptohelper

import (
	"encoding/hex"
	"fmt"
)

// FIXME: I need to properly implement this fn
func DetectAESType(keyStr string) (string, error) {
	// Attempt to decode the key string as hex (if it's in hex format)
	decodedKey, err := hex.DecodeString(keyStr)
	if err != nil {
		// If it's not hex-encoded, use the raw string length
		decodedKey = []byte(keyStr)
	}

	keyLength := len(decodedKey)

	// Determine the AES type based on the key length
	var aesType string
	switch keyLength {
	case 16:
		aesType = "AES-128"
	case 24:
		aesType = "AES-192"
	case 32:
		aesType = "AES-256"
	default:
		return "", fmt.Errorf("unknown key length %d bytes", keyLength)
	}

	return aesType, nil
}
