import weatherIcons from "./../data/weatherIcons.json";
import {
    WiDaySunny,
    WiDaySunnyOvercast,
    WiDayCloudy,
    WiCloudy,
    WiDayFog,
    WiFog,
    WiDaySprinkle,
    WiDaySleet,
    WiDayShowers,
    WiDayRain,
    WiRain,
    WiDayRainMix,
    WiDaySnow,
    WiSnow,
    WiDaySnowWind,
    WiDaySleetStorm,
    WiDayThunderstorm,
    WiThunderstorm,
    WiRainMix,
    WiDayLightning,
    WiDayHail,
    WiHail,
    WiSnowWind,
    WiStormShowers,
} from "weather-icons-react";

function WeatherIcon(props) {
    let returnedIcon = weatherIcons["weatherIconCodes"][props.weatherId.toString()];
    let size = 24;
    if (props.size != null) size = props.size;
    let color = "#000";
    if (props.color != null) color = props.color;

    // We generated SVG icons from react icons on this page https://css-tricks.com/using-svg/
    switch (returnedIcon) {
        case "WiDaySunny":
            return <WiDaySunny size={size} color={color} />;
        case "WiDaySunnyOvercast":
            return <WiDaySunnyOvercast size={size} color={color} />;
        case "WiDayCloudy":
            return <WiDayCloudy size={size} color={color} />;
        case "WiCloudy":
            return <WiCloudy size={size} color={color} />;
        case "WiDayFog":
            return <WiDayFog size={size} color={color} />;
        case "WiFog":
            return <WiFog size={size} color={color} />;
        case "WiDaySprinkle":
            return <WiDaySprinkle size={size} color={color} />;
        case "WiDaySleet":
            return <WiDaySleet size={size} color={color} />;
        case "WiDayShowers":
            return <WiDayShowers size={size} color={color} />;
        case "WiDayRain":
            return <WiDayRain size={size} color={color} />;
        case "WiRain":
            return <WiRain size={size} color={color} />;
        case "WiDayRainMix":
            return <WiDayRainMix size={size} color={color} />;
        case "WiDaySnow":
            return <WiDaySnow size={size} color={color} />;
        case "WiSnow":
            return <WiSnow size={size} color={color} />;
        case "WiDaySnowWind":
            return <WiDaySnowWind size={size} color={color} />;
        case "WiDaySleetStorm":
            return <WiDaySleetStorm size={size} color={color} />;
        case "WiDayThunderstorm":
            return <WiDayThunderstorm size={size} color={color} />;
        case "WiThunderstorm":
            return <WiThunderstorm size={size} color={color} />;
        case "WiRainMix":
            return <WiRainMix size={size} color={color} />;
        case "WiDayLightning":
            return <WiDayLightning size={size} color={color} />;
        case "WiDayHail":
            return <WiDayHail size={size} color={color} />;
        case "WiHail":
            return <WiHail size={size} color={color} />;
        case "WiSnowWind":
            return <WiSnowWind size={size} color={color} />;
        case "WiStormShowers":
            return <WiStormShowers size={size} color={color} />;
    }

    return <div></div>;
}

export default WeatherIcon;
