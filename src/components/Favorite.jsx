import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Form, Button, InputGroup, Table } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useCookies } from "react-cookie";
import languages from "./../data/languages.json";
import allCities from "./../data/allCities.json";
import { Link } from "react-router-dom";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";

function Favorite() {
    // map constants
    const [markers, setMarkers] = useState([]);
    function getCityFromAllCities(city) {
        for (let i = 0; i < allCities.length; i++) {
            if (allCities[i].city == city) {
                return allCities[i];
            }
        }
    }
    function getAllTemperatures() {
        setMarkers([]);
        cookies.favorite.map((f) => {
            let city = getCityFromAllCities(f);
            let marker = {
                markerOffset: 0,
                name: f,
                coordinates: [parseFloat(city.lng), parseFloat(city.lat)],
                temperature: null,
            };
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

    const [singleSelections, setSingleSelections] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["favorite"]);
    if (cookies.favorite == null) {
        setCookie("favorite", [], { path: "/" });
    }

    let options = [];

    allCities.map((city) => {
        if (!cookies.favorite.includes(city.city)) {
            options.push(city.city);
        }
    });

    function removeFavorite(favoriteName) {
        let arrFromCookie = cookies.favorite;
        console.log(favoriteName);
        if (arrFromCookie.includes(favoriteName.f)) {
            let index = arrFromCookie.indexOf(favoriteName.f);
            arrFromCookie.splice(index, 1);
            setCookie("favorite", arrFromCookie, { path: "/" });
            getAllTemperatures();
        } else console.log("Favorite is not in the list");
    }

    function removeAllFavorite() {
        setCookie("favorite", [], { path: "/" });
    }

    useEffect(() => getAllTemperatures(), []);

    return (
        <div>
            <div className="row">&nbsp;</div>
            <div className="row">
                <h2>{languages[cookies.language]["favorite"]}</h2>
                <div className="row">&nbsp;</div>
                <Form.Group>
                    <InputGroup className="mb-3">
                        <Typeahead
                            id="basic-typeahead-single"
                            labelKey="name"
                            onChange={setSingleSelections}
                            options={options}
                            placeholder={languages[cookies.language]["selectCitySearch"]}
                            selected={singleSelections}
                            emptyLabel={languages[cookies.language]["noMatchesFound"]}
                        />
                        <Button
                            onClick={() => {
                                let arrFromCookie = cookies.favorite;
                                if (!arrFromCookie.includes(singleSelections[0]) && singleSelections[0] != null) {
                                    arrFromCookie.push(singleSelections[0]);
                                    setCookie("favorite", arrFromCookie, { path: "/" });
                                    getAllTemperatures();
                                } else console.log("Is already added to favorite or is null");
                                setSingleSelections([]);
                            }}
                            variant="outline-secondary"
                        >
                            {languages[cookies.language]["add"]}
                        </Button>
                    </InputGroup>
                </Form.Group>
            </div>
            <div className="row">&nbsp;</div>
            <div className="row">&nbsp;</div>

            {cookies.favorite.length > 0 && (
                <div>
                    <div className="row">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{languages[cookies.language]["city"]}</th>
                                    <th>{languages[cookies.language]["remove"]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cookies.favorite.map((f) => (
                                    <tr>
                                        <td className="favorite-table-td">
                                            <Link className="favorite-city" to={"/city/" + f}>
                                                {f}
                                            </Link>
                                        </td>
                                        <td>
                                            <Button variant="danger" onClick={() => removeFavorite({ f })}>
                                                {languages[cookies.language]["remove"]}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="row">
                        <Button variant="danger" onClick={() => removeAllFavorite()}>
                            {languages[cookies.language]["removeAllFavorites"]}
                        </Button>
                    </div>
                    <div className="row">&nbsp;</div>

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
                        </ComposableMap>
                    </div>
                </div>
            )}
            {cookies.favorite.length == 0 && (
                <div className="row">
                    <span className="no-favorite">{languages[cookies.language]["noFavorites"]}</span>
                </div>
            )}
        </div>
    );
}
export default Favorite;
