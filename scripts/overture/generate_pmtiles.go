package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"log/slog"

	"github.com/protomaps/go-pmtiles/pmtiles"
)

func handleError(err error, msg string) {
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
	// TODO: Delete
	defer fmt.Println("deferred")
	fmt.Println("not deferred")
	//

	out, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, res.Body)
	return err
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
	handleError(err, "reading SQL file")

	release := "2025-11-19.0"
	// release := os.Getenv("OVERTURE_RELEASE")
	duckQuery := strings.ReplaceAll(string(sqlBytes), "{{RELEASE}}", release)

	slog.Info("running duckdb", "release", release)

	err = runCmd("duckdb", "-c", duckQuery)
	handleError(err, "running duckdb")

	// Generate .pmtiles with tippecanoe
	// tippecanoeUrl := "https://github.com/mapbox/tippecanoe/archive/refs/tags/1.36.0.tar.gz"
	// tippecanoeUrl := "https://github.com/mapbox/tippecanoe/archive/refs/tags/1.36.0.zip"
	// TODO: Doesnt exist, download cd and then execute
	tippecanoeUrl := "https://github.com/mapbox/tippecanoe/releases/download/1.36.0/tippecanoe.linux.x86_64"
	tippecanoeFileName := "tippecanoe"

	slog.Info("downloading tippecanoe...", "url", tippecanoeUrl)

	err = download(tippecanoeUrl, tippecanoeFileName)
	handleError(err, "downloading tippecanoe")

	err = os.Chmod(tippecanoeFileName, 0755)
	handleError(err, "making tippecanoe executable")

	// Create mbtiles
	slog.Info("building tiles...")

	// TODO: Adjust params
	err = runCmd(
		"./"+tippecanoeFileName,
		"-o", "overture.mbtiles",
		"--minimum-zoom=0",
		"--maximum-zoom=14",
		"--coalesce",
		"--hilbert",
		"roads.ndjson",
		"divisions.ndjson",
		"rivers.ndjson",
	)
	handleError(err, "building tiles")

	// Convert to pmtiles
	slog.Info("converting mbtiles to pmtiles")

	inFile := "overture.mbtiles"
	outFile := "overture.pmtiles"

	in, err := os.Open(inFile)
	handleError(err, "opening mbtiles")
	defer in.Close()

	out, err := os.Create(outFile)
	handleError(err, "creating pmtiles file")
	defer out.Close()

	tempFile, err := os.CreateTemp("", "basemapId.tmp")
	handleError(err, "create temp file")

	var stdlogger = log.New(os.Stdout, "[pmtiles] ", log.LstdFlags)
	err = pmtiles.Convert(stdlogger, in.Name(), out.Name(), true, tempFile)
	handleError(err, "converting to pmtiles")

	slog.Info("completed", "pmtiles", outFile)
}
