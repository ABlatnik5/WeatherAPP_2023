import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { Link } from "react-router-dom";
import markersInit from "./../data/cities.json";

const MapChart = () => {
    // const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [markers, setMarkers] = useState([]);
    const controller = new AbortController();

    // function handleZoomIn() {
    //   if (position.zoom >= 4) return;
    //   setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
    // }

    // function handleZoomOut() {
    //   if (position.zoom <= 1) return;
    //   setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
    // }

    // function handleMoveEnd(position) {
    //   setPosition(position);
    // }

    function getAllTemperatures() {
        markersInit.map((marker) => {
            let url =
                "https://api.open-meteo.com/v1/forecast?latitude=" +
                marker.coordinates[1] +
                "&longitude=" +
                marker.coordinates[0] +
                "&current_weather=true";
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    marker.temperature = data.current_weather.temperature;
                    setMarkers((markers) => [...markers, marker]);
                });
        });
    }

    useEffect(() => getAllTemperatures(), []);

    return (
        <div>
            <ComposableMap
                //projection="geoAzimuthalEqualArea"
                projectionConfig={{
                    center: [15, 46.1],
                    scale: 22000,
                }}
                className="map-area"
                width="1200"
            >
                {/* <ZoomableGroup> */}
                <Geographies geography="regions.json">
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                    default: {
                                        fill: "#bbdefb",
                                        outline: "none",
                                    },
                                    hover: {
                                        fill: "#bbdefb",
                                        outline: "none",
                                    },
                                    pressed: {
                                        fill: "#bbdefb",
                                        outline: "none",
                                    },
                                }}
                            />
                        ))
                    }
                </Geographies>
                {markers.map(({ name, coordinates, markerOffset, temperature }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <text textAnchor="middle" y={markerOffset}>
                            <Link className="map-city" to={"/city/" + name}>
                                {name}
                            </Link>
                        </text>
                        <text className="map-city-temperature" textAnchor="middle" y={markerOffset + 15}>
                            {temperature}&#x2103;
                        </text>
                    </Marker>
                ))}
                {/* </ZoomableGroup> */}
            </ComposableMap>
        </div>
    );
};

export default MapChart;
