package tiles

import (
	"archive/zip"
	"errors"
	"io"
	"net/http"
	"os"
	"overture/validator"
	"path/filepath"
	"strings"

	"log/slog"

	_ "github.com/duckdb/duckdb-go/v2"
)

// Downloads from given url and saves as given file name
func download(url, fileName string) error {
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	out, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, res.Body)
	return err
}

// Returns unzipped directory name
func unzip(destination string, fileName string) (string, error) {
	archive, err := zip.OpenReader(fileName)
	validator.ExitIfError(err, "unzip")
	defer archive.Close()

	var directory string

	for i, file := range archive.File {
		filePath := filepath.Join(destination, file.Name)

		if !strings.HasPrefix(filePath, filepath.Clean(destination)+string(os.PathSeparator)) {
			return "", errors.New("invalid path")
		}
		if file.FileInfo().IsDir() {
			if i == 0 {
				directory = file.Name
				slog.Info("Directory", fileName, directory)
			}
			os.MkdirAll(filePath, 0o755)
			continue
		}

		err = os.MkdirAll(filepath.Dir(filePath), 0o755)
		validator.ExitIfError(err, "")

		destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		validator.ExitIfError(err, filePath)

		fileInArchive, err := file.Open()
		validator.ExitIfError(err, file.Name)

		_, err = io.Copy(destinationFile, fileInArchive)
		validator.ExitIfError(err, "copy file")

		destinationFile.Close()
		fileInArchive.Close()
	}

	slog.Info("Unzipped", "directory", directory)

	return directory, nil
}
