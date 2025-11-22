package tiles

import (
	"database/sql"
	"fmt"
	"os"
	"os/exec"
	"overture/validator"
	"strings"

	"log/slog"

	_ "github.com/duckdb/duckdb-go/v2"
)

var defaultOvertureRelease = "2025-11-19.0"
var tippecanoeUrl = "https://github.com/felt/tippecanoe/archive/refs/heads/main.zip"

// Returns directory with unzipped tippecanoe files
func SetupTippecanoe() string {
	slog.Info("setting up tippecanoe...")

	zipFile := "tippecanoe.zip"

	slog.Info("downloading tippecanoe...", "url", tippecanoeUrl)
	err := download(tippecanoeUrl, zipFile)
	validator.ExitIfError(err, "downloading tippecanoe")
	defer os.RemoveAll(zipFile)

	currentPath, err := os.Getwd()
	validator.ExitIfError(err, "current path")

	slog.Info("unzipping tippecanoe...", "zip file", zipFile)
	unpackedDir, err := unzip(currentPath, zipFile)
	validator.ExitIfError(err, "unzipping tippecanoe")

	slog.Info("installing tippecanoe...")
	cmd := exec.Command("sh", "-c", "make -j && make install")
	cmd.Dir = unpackedDir
	_, err = cmd.CombinedOutput()
	validator.ExitIfError(err, "installing tippecanoe")

	slog.Info("tippecanoe installed")

	return unpackedDir
}

// Queries overture using duckdb.
// Installs tippecanoe.
// Generates pmtiles using tippecanoe.
func Generate(fileName string, tippecanoeDir string) {
	overtureRelease := getOvertureRelease()
	geojsonFileName := queryOverture(overtureRelease, fileName)
	defer os.RemoveAll(geojsonFileName)

	createPmtiles(tippecanoeDir, fileName)
}

// Gets overture release from environment variable. If variable not available uses the default.
func getOvertureRelease() string {
	overtureRelease := os.Getenv("OVERTURE_RELEASE")
	if overtureRelease == "" {
		return defaultOvertureRelease
	}
	return overtureRelease
}

// Gets the sql query from /sql/fileName and uses it in duckdb to get data from overture.
// Data is saved as fileName.geojson
func queryOverture(release string, fileName string) string {
	slog.Info("grabbing sql query...", "file name", fileName)
	sqlBytes, err := os.ReadFile(fmt.Sprintf("sql/%s.sql", fileName))
	validator.ExitIfError(err, "grabbing sql query")

	fileName += ".geojson"
	duckQuery := strings.ReplaceAll(string(sqlBytes), "{{RELEASE}}", release)
	duckQuery = strings.ReplaceAll(duckQuery, "{{FILE_NAME}}", fileName)

	slog.Info("opening duckdb...")
	db, err := sql.Open("duckdb", "")
	validator.ExitIfError(err, "opening duckdb")
	defer db.Close()

	slog.Info("running duckdb query...", "release", release)
	_, err = db.Exec(duckQuery)
	validator.ExitIfError(err, "running duckdb query")

	slog.Info("overture file saved", "file name", fileName)

	return fileName
}

// Creates pmtiles and saves under fileName.pmtiles
func createPmtiles(unpackedDir string, fileName string) {
	slog.Info("building pmtiles...")

	// TODO: pass params and file names via args
	cmd := exec.Command(
		"tippecanoe",
		"-fo", fmt.Sprintf("../%s.pmtiles", fileName),
		"-l", fileName,
		"-zg",
		fmt.Sprintf("../%s.geojson", fileName),
	)
	cmd.Dir = unpackedDir
	_, err := cmd.CombinedOutput()
	validator.ExitIfError(err, "building pmtiles")

	slog.Info("pmtiles built", "file name", fileName+".pmtiles")
}
