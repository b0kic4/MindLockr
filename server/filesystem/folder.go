package filesystem

import (
	"context"
	"errors"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type FolderPathFromClient struct {
	Path string `json:"path"`
}

func (f *Folder) UpdateFolderPath(folderPath string) {
	f.folderPath = folderPath
}

type Folder struct {
	folderPath string
	ctx        context.Context // wails app runtime context
}

// NewFolder creates a new instance of Folder with an empty folder path
func NewFolder() *Folder {
	return &Folder{}
}

// SetContext sets the context for the Folder struct
func (f *Folder) SetContext(ctx context.Context) {
	f.ctx = ctx
}

// SelectFolder opens a folder selection dialog and updates the folder path
func (f *Folder) SelectFolder() (string, error) {
	if f.ctx == nil {
		return "", errors.New("context not set")
	}

	// Open the folder selection dialog
	folder, err := runtime.OpenDirectoryDialog(f.ctx, runtime.OpenDialogOptions{
		Title: "Select Destination Folder",
	})
	if err != nil {
		return "", err
	}

	// Set the selected folder path
	f.folderPath = folder
	return folder, nil
}

// GetFolderPath returns the currently selected folder path
func (f *Folder) GetFolderPath() string {
	return f.folderPath
}

// ListFiles returns a list of all files in the folder
func (f *Folder) ListFiles() ([]string, error) {
	if f.folderPath == "" {
		return nil, errors.New("no folder selected")
	}

	var files []string
	err := filepath.Walk(f.folderPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			files = append(files, path)
		}
		return nil
	})
	return files, err
}

// CreateFile creates a new file in the selected folder
func (f *Folder) CreateFile(filename, content string) error {
	if f.folderPath == "" {
		return errors.New("no folder selected")
	}

	filePath := filepath.Join(f.folderPath, filename)
	return os.WriteFile(filePath, []byte(content), 0644)
}

// RemoveFile removes a file in the folder
func (f *Folder) RemoveFile(filename string) error {
	if f.folderPath == "" {
		return errors.New("no folder selected")
	}

	filePath := filepath.Join(f.folderPath, filename)
	return os.Remove(filePath)
}
