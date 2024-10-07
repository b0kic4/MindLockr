package main

import (
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	"MindLockr/server/filesystem"
	"MindLockr/server/filesystem/keys"
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/*
var assets embed.FS

func main() {
	symmetric_encryption := &symmetricencryption.Cryptography{}
	symmetric_decryption := &symmetricdecryption.Cryptography{}
	folder := filesystem.GetFolderInstance()
	keyRetrieve := keys.NewKeyRetrieve(folder)
	keyStore := &keys.KeyStore{}
	pubPrivKeys := &keys.PubPrvKeyGen{}

	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "MindLockr",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			folder.SetContext(ctx)
		},
		Bind: []interface{}{
			app,
			symmetric_encryption,
			symmetric_decryption,
			folder,
			keyRetrieve,
			keyStore,
			pubPrivKeys,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
