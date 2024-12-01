import maplibregl from "maplibre-gl";

export const osmStyle: maplibregl.StyleSpecification = {
    "version": 8,
    "sources": {
        "osm": {
            "type": "raster",
            "tiles": [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            "tileSize": 256
        }
    },
    "layers": [
        {
            "id": "osm",
            "type": "raster",
            "source": "osm"
        }
    ]
}
