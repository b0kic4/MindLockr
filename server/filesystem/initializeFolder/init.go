package initializeFolder

import (
	"context"
	"errors"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var ErrContextNotSet = errors.New("context not set")

type InitializeFolder struct {
	ctx context.Context
}

// NewInitializeFolder creates a new instance without context
func NewInitializeFolder() *InitializeFolder {
	return &InitializeFolder{}
}

// SetContext sets the context when the app starts
func (i *InitializeFolder) SetContext(ctx context.Context) {
	i.ctx = ctx
}

// SelectFolder opens a folder selection dialog
func (i *InitializeFolder) SelectFolder() (string, error) {
	if i.ctx == nil {
		return "", ErrContextNotSet
	}

	folder, err := runtime.OpenDirectoryDialog(i.ctx, runtime.OpenDialogOptions{
		Title: "Select Destination Folder",
	})
	if err != nil {
		return "", err
	}

	return folder, nil
}
