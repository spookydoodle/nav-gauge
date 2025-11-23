import { MapStyle } from "./model";
import osmStyle from "./osm.json";

export const MAP_STYLES: [string, MapStyle][] = [
    [
        'osm',
        {
            name: 'OpenStreetMap',
            style: osmStyle,
            attribution: {
                text: "OpenStreetMap",
                href: "https://openstreetmap.org/copyright"
            }
        }
    ],
    [
        'custom-roads',
        {
            name: 'Custom roads',
            style: {
                version: 8,
                sources: {
                    ['custom-roads']: {
                        type: 'vector',
                        url: `pmtiles:///tiles/roads.pmtiles`,
                    }
                },
                layers: [
                    {
                        id: 'custom-roads',
                        source: 'custom-roads',
                        "source-layer": "roads",
                        type: 'line',
                        paint: {
                            'line-color': 'rgba(0, 0, 0, .2)',
                            'line-width': 5
                        }
                    }
                ]
            },
            attribution: {
                text: "Overture Maps",
                href: "https://docs.overturemaps.org/attribution"
            }
        }
    ]
];