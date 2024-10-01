package main

import (
	"MindLockr/server/cryptography/encryption"
	"MindLockr/server/filesystem/initializeFolder"
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	crypto := &encryption.Cryptography{}
	folderInit := &initializeFolder.InitializeFolder{}
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
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
			folderInit.SetContext(ctx)
		},
		Bind: []interface{}{
			app,
			crypto,
			folderInit,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
