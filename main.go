package main

import (
	hybdec "MindLockr/server/cryptography/decryption/hyb_dec"
	symmetricdecryption "MindLockr/server/cryptography/decryption/symmetric_decryption"
	hybenc "MindLockr/server/cryptography/encryption/hyb_enc"
	symmetricencryption "MindLockr/server/cryptography/encryption/symmetric_encryption"
	pgpdec "MindLockr/server/cryptography/pgp/pgp_dec"
	pgpgen "MindLockr/server/cryptography/pgp/pgp_gen"
	"MindLockr/server/filesystem"
	"MindLockr/server/filesystem/en"
	pgpfs "MindLockr/server/filesystem/pgp_fs"
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/*
var assets embed.FS

func main() {
	symmetric_encryption := &symmetricencryption.Cryptography{}
	symmetric_decryption := &symmetricdecryption.Cryptography{}
	hyb_enc := &hybenc.HybEnc{}
	hyb_dec := &hybdec.HybDec{}
	folder := filesystem.GetFolderInstance()
	enRetrieve := en.NewEnRetrieve(folder)
	keyStore := &en.KeyStore{}
	pgp_gen := &pgpgen.PgpKeysGen{}
	pgp_get := pgpfs.NewPgpRetrieve(folder)
	pgp_dec := &pgpdec.PgpDec{}

	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "MindLockr",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Windows: &windows.Options{
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			BackdropType:                      windows.Mica,
			DisablePinchZoom:                  false,
			DisableWindowIcon:                 false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:               "",
			WebviewBrowserPath:                "",
			Theme:                             windows.SystemDefault,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar:   windows.RGB(20, 20, 20),
				DarkModeTitleText:  windows.RGB(200, 200, 200),
				DarkModeBorder:     windows.RGB(20, 0, 20),
				LightModeTitleBar:  windows.RGB(200, 200, 200),
				LightModeTitleText: windows.RGB(20, 20, 20),
				LightModeBorder:    windows.RGB(200, 200, 200),
			},
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
				HideTitle:                  false,
				HideTitleBar:               false,
				FullSizeContent:            false,
				UseToolbar:                 false,
				HideToolbarSeparator:       true,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  false,
			About: &mac.AboutInfo{
				Title:   "MindLockr",
				Message: "Privacy Taken Seriously",
				// Icon:    icon,
			},
		},
		Linux: &linux.Options{
			// Icon:                icon,
			WindowIsTranslucent: false,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyAlways,
			ProgramName:         "wails",
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: false,
		},

		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			folder.SetContext(ctx)
		},
		Bind: []interface{}{
			app,
			symmetric_encryption,
			symmetric_decryption,
			folder,
			enRetrieve,
			keyStore,
			pgp_gen,
			pgp_get,
			pgp_dec,
			hyb_enc,
			hyb_dec,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
