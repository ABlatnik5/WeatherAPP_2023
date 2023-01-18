import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import cities from "./../data/allCities.json";
import languages from "./../data/languages.json";
import { useParams } from "react-router-dom";
import WeatherIcon from "./WeatherIcon";
import { useCookies } from "react-cookie";
import LineChart from "./LineChart";

const City = () => {
    const [currentWeather, setCurrentWeather] = useState({});
    const [loading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCurrentWeather, setShowCurrentWeather] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(["language"]);

    let { cityId } = useParams();

    function getWeatherData() {
        cities.map((city) => {
            if (city.city == cityId) {
                let url =
                    "https://api.open-meteo.com/v1/forecast?latitude=" +
                    city.lat +
                    "&longitude=" +
                    city.lng +
                    "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,surface_pressure,cloudcover,weathercode,windspeed_10m&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,precipitation_sum&timezone=Europe%2FBerlin";

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        setCurrentWeather(data);
                        let currentTime = data.current_weather.time;
                        for (let i = 0; i < data.hourly.time.length; i++) {
                            if (data.hourly.time[i] == currentTime) {
                                setCurrentIndex(i);
                                break;
                            }
                        }
                        setIsLoading(false);
                    });
            }
        });
    }

    function resolveWeatherCode(weatherCode) {
        return languages[cookies.language]["weatherCodes"][weatherCode.toString()];
    }

    function resolveDate(date) {
        const selectedDate = new Date(date);
        const options = { weekday: "long" };
        let langExpanded = "sl-SI";
        if (cookies.language == "en") langExpanded = "en-GB";
        return Intl.DateTimeFormat(langExpanded, options).format(selectedDate) + ", " + Intl.DateTimeFormat(langExpanded).format(selectedDate);
    }

    const currentWeatherHandler = () => {
        setShowCurrentWeather(true);
    };
    const weatherForecastHandler = () => {
        setShowCurrentWeather(false);
    };

    useEffect(() => getWeatherData(), []);

    // loading, če je počasno
    if (loading)
        return (
            <div>
                <h1>{cityId}</h1>
                Loading...
            </div>
        );

    // trenutno vreme
    if (showCurrentWeather)
        return (
            <div>
                <h1>{cityId}</h1>
                <div className="row">
                    <div className="col-12">
                        <Button variant="primary" onClick={currentWeatherHandler}>
                            {languages[cookies.language]["currentWeather"]}
                        </Button>
                        &nbsp;
                        <Button variant="light" onClick={weatherForecastHandler}>
                            {languages[cookies.language]["weatherForecast"]}
                        </Button>
                    </div>
                </div>
                <div className="row">&nbsp;</div>
                <div className="row">
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td rowSpan={3} valign="middle" className="current-weather-temperature">
                                    {currentWeather.current_weather.temperature}
                                    {currentWeather.hourly_units.temperature_2m}
                                </td>
                                <td>{languages[cookies.language]["feeling_weather"]}</td>
                                <td>
                                    {currentWeather.hourly.apparent_temperature[currentIndex]}
                                    {currentWeather.hourly_units.apparent_temperature}
                                </td>
                            </tr>
                            <tr>
                                <td>{languages[cookies.language]["humidity_weather"]}</td>
                                <td>
                                    {currentWeather.hourly.relativehumidity_2m[currentIndex]}
                                    {currentWeather.hourly_units.relativehumidity_2m}
                                </td>
                            </tr>
                            <tr>
                                <td>{languages[cookies.language]["pressure_weather"]}</td>
                                <td>
                                    {currentWeather.hourly.surface_pressure[currentIndex]} {currentWeather.hourly_units.surface_pressure}
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan={2} valign="middle" className="current-weather-code">
                                    {resolveWeatherCode(currentWeather.hourly.weathercode[currentIndex])}{" "}
                                    <WeatherIcon weatherId={currentWeather.hourly.weathercode[currentIndex]} size={80} color="#000" />
                                </td>
                                <td>{languages[cookies.language]["windspeed_weather"]}</td>
                                <td>
                                    {currentWeather.current_weather.windspeed} {currentWeather.hourly_units.windspeed_10m}
                                </td>
                            </tr>
                            <tr>
                                <td>{languages[cookies.language]["cloudcover_weather"]}</td>
                                <td>
                                    {currentWeather.hourly.cloudcover[currentIndex]}
                                    {currentWeather.hourly_units.cloudcover}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="row">
                    <LineChart
                        dataTemperature={currentWeather.hourly.temperature_2m.slice(0, 25)}
                        dataPrecipitation={currentWeather.hourly.precipitation.slice(0, 25)}
                        labels={currentWeather.hourly.time.slice(0, 25)}
                        graphTitle={languages[cookies.language]["graphToday"]}
                        weatherState={currentWeather.hourly.weathercode.slice(0, 25)}
                    ></LineChart>
                </div>
                <div className="row">&nbsp;</div>
                <div className="row">&nbsp;</div>
            </div>
        );

    // vremenska napoved
    return (
        <div>
            <h1>{cityId}</h1>
            <div className="row">
                <div className="col-12">
                    <Button variant="light" onClick={currentWeatherHandler}>
                        {languages[cookies.language]["currentWeather"]}
                    </Button>
                    &nbsp;
                    <Button variant="primary" onClick={weatherForecastHandler}>
                        {languages[cookies.language]["weatherForecast"]}
                    </Button>
                </div>
            </div>
            <div className="row">&nbsp;</div>
            <div className="row">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>{languages[cookies.language]["minTemperature"]}</th>
                            <th>{languages[cookies.language]["maxTemperature"]}</th>
                            <th>{languages[cookies.language]["weather"]}</th>
                            <th>{languages[cookies.language]["precipitation"]}</th>
                            <th>{languages[cookies.language]["windspeed_weather"]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWeather.daily.time.map((t, index) => (
                            <tr>
                                <td>{resolveDate(t)}</td>
                                <td>
                                    {currentWeather.daily.temperature_2m_min[index]}
                                    {currentWeather.daily_units.temperature_2m_min}
                                </td>
                                <td>
                                    {currentWeather.daily.temperature_2m_max[index]}
                                    {currentWeather.daily_units.temperature_2m_max}
                                </td>
                                <td>
                                    {resolveWeatherCode(currentWeather.daily.weathercode[index])}{" "}
                                    <WeatherIcon weatherId={currentWeather.daily.weathercode[index]} size={40} color="#000" />
                                </td>
                                <td>
                                    {currentWeather.daily.precipitation_sum[index]} &thinsp;
                                    {currentWeather.daily_units.precipitation_sum}
                                </td>
                                <td>
                                    {currentWeather.daily.windspeed_10m_max[index]} &thinsp;
                                    {currentWeather.daily_units.windspeed_10m_max}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="row">
                <LineChart
                    dataTemperature={currentWeather.hourly.temperature_2m.filter(function (value, index, Arr) {
                        return index % 6 == 0;
                    })}
                    dataPrecipitation={currentWeather.hourly.precipitation.filter(function (value, index, Arr) {
                        return index % 6 == 0;
                    })}
                    labels={currentWeather.hourly.time.filter(function (value, index, Arr) {
                        return index % 6 == 0;
                    })}
                    xAxisFormat="full"
                    graphTitle={languages[cookies.language]["graphWeekly"]}
                    weatherState={currentWeather.hourly.weathercode.filter(function (value, index, Arr) {
                        return index % 6 == 0;
                    })}
                ></LineChart>
            </div>
            <div className="row">&nbsp;</div>
            <div className="row">&nbsp;</div>
        </div>
    );
};

export default City;
