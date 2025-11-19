package main

import (
	"archive/zip"
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"log/slog"

	_ "github.com/duckdb/duckdb-go/v2"
	"github.com/protomaps/go-pmtiles/pmtiles"
)

func exitIfError(err error, msg string) {
	if err != nil {
		slog.Error(msg, "error", err)
		os.Exit(1)
	}
}

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

func unzip(destination string, fileName string) {
	archive, err := zip.OpenReader(fileName)
	exitIfError(err, "unzip")
	defer archive.Close()

	for _, file := range archive.File {
		filePath := filepath.Join(destination, file.Name)
		fmt.Println("unzipped file ", filePath)

		if !strings.HasPrefix(filePath, filepath.Clean(destination)+string(os.PathSeparator)) {
			fmt.Println("invalid path")
			return
		}
		if file.FileInfo().IsDir() {
			fmt.Println("creating directory")
			os.MkdirAll(filePath, os.ModePerm)
			continue
		}

		err = os.MkdirAll(filepath.Dir(filePath), os.ModePerm)
		exitIfError(err, "")

		destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		exitIfError(err, filePath)

		fileInArchive, err := file.Open()
		exitIfError(err, file.Name)

		_, err = io.Copy(destinationFile, fileInArchive)
		exitIfError(err, "copy file")

		destinationFile.Close()
		fileInArchive.Close()
	}
}

func runCmd(name string, args ...string) error {
	slog.Info("running command", name, args)
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func main() {
	var logger *slog.Logger

	if os.Getenv("CI") != "" {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
	} else {
		logger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	}
	slog.SetDefault(logger)

	slog.Info("starting...")

	// Fetch from duckdb
	sqlBytes, err := os.ReadFile("sql/data.sql")
	exitIfError(err, "reading SQL file")

	release := "2025-11-19.0"
	// release := os.Getenv("OVERTURE_RELEASE")
	duckQuery := strings.ReplaceAll(string(sqlBytes), "{{RELEASE}}", release)
	fmt.Println(duckQuery)
	slog.Info("running duckdb", "release", release)

	db, err := sql.Open("duckdb", "")
	exitIfError(err, "duckdb")
	defer db.Close()

	_, err = db.Exec(duckQuery)

	// Download tippecanoe
	tippecanoeUrl := "https://github.com/mapbox/tippecanoe/archive/refs/tags/1.36.0.zip"
	tippecanoeDir := "tippecanoe"
	tippecanoeZip := "tippecanoe.zip"
	slog.Info("downloading tippecanoe...", "url", tippecanoeUrl)
	err = download(tippecanoeUrl, tippecanoeZip)
	exitIfError(err, "downloading tippecanoe")

	// Unzip tippencanoe
	currentPath, err := os.Getwd()
	exitIfError(err, "current path")

	unzip(currentPath, tippecanoeZip)
	os.RemoveAll(tippecanoeZip)
	defer os.RemoveAll(tippecanoeDir)

	// Create mbtiles
	slog.Info("building tiles...")

	// TODO: Adjust params
	err = runCmd(
		"./"+tippecanoeDir,
		"-o", "overture.mbtiles",
		"--minimum-zoom=0",
		"--maximum-zoom=14",
		"--coalesce",
		"--hilbert",
		"roads.ndjson",
		"divisions.ndjson",
		"rivers.ndjson",
	)
	exitIfError(err, "building tiles")

	// Convert to pmtiles
	slog.Info("converting mbtiles to pmtiles")

	inFile := "overture.mbtiles"
	outFile := "overture.pmtiles"

	in, err := os.Open(inFile)
	exitIfError(err, "opening mbtiles")
	defer in.Close()

	out, err := os.Create(outFile)
	exitIfError(err, "creating pmtiles file")
	defer out.Close()

	tempFile, err := os.CreateTemp("", "basemapId.tmp")
	exitIfError(err, "create temp file")

	var stdlogger = log.New(os.Stdout, "[pmtiles] ", log.LstdFlags)
	err = pmtiles.Convert(stdlogger, in.Name(), out.Name(), true, tempFile)
	exitIfError(err, "converting to pmtiles")

	slog.Info("completed", "pmtiles", outFile)
}
