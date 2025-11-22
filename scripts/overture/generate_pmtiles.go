package main

import (
	"log/slog"
	"os"
	"overture/tiles"

	_ "github.com/duckdb/duckdb-go/v2"
)

func main() {
	var logger *slog.Logger

	if os.Getenv("CI") != "" {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
	} else {
		logger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	}

	slog.SetDefault(logger)

	tippecanoeDir := tiles.SetupTippecanoe()
	defer os.RemoveAll(tippecanoeDir)

	tiles.Generate("roads", tippecanoeDir)
}
