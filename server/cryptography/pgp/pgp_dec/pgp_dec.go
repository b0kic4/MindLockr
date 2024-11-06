package pgpdec

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/ProtonMail/gopenpgp/v3/crypto"
)

type PgpDec struct{}

func (pgpdec *PgpDec) DecryptPgpPrivKey(passphrase string, keyPath string) (string, error) {
	// Read the armored encrypted private key from the file
	privKeyPath := filepath.Join(keyPath, "private.asc")

	encryptedPrivKeyArmor, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", fmt.Errorf("failed to read private key file: %v", err)
	}

	// Load the armored key into a crypto.Key object
	encryptedKeyObj, err := crypto.NewKeyFromArmored(string(encryptedPrivKeyArmor))
	if err != nil {
		return "", fmt.Errorf("failed to parse armored private key: %v", err)
	}

	// Unlock the key using the passphrase
	unlockedKeyObj, err := encryptedKeyObj.Unlock([]byte(passphrase))
	if err != nil {
		return "", fmt.Errorf("failed to unlock private key %v", err)
	}

	// Optionally, you can re-armor the unlocked key if you need the decrypted armored key
	decryptedPrivKeyArmor, err := unlockedKeyObj.Armor()
	if err != nil {
		return "", fmt.Errorf("failed to armor unlocked private key: %v", err)
	}
	return decryptedPrivKeyArmor, nil
}
