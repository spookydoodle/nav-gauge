package validator

import (
	"os"

	"log/slog"

	_ "github.com/duckdb/duckdb-go/v2"
)

func ExitIfError(err error, msg string) {
	if err != nil {
		slog.Error(msg, "error", err)
		os.Exit(1)
	}
}
