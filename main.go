package main

import (
	"MindLockr/server/cryptography/decryption"
	"MindLockr/server/cryptography/encryption"
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
	crypto := &encryption.Cryptography{}
	decrypt := &decryption.Cryptography{}
	folder := filesystem.NewFolder()
	keyRetrieve := keys.NewKeyRetrieve(folder)
	keyStore := &keys.KeyStore{}

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
			crypto,
			folder,
			keyRetrieve,
			keyStore,
			decrypt,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
