import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Title,
    Tooltip,
    LineController,
    BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useCookies } from "react-cookie";
import languages from "./../data/languages.json";
import weatherIcons from "./../data/weatherIcons.json";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, BarController);

function LineChart(props) {
    const [cookies, setCookie, removeCookie] = useCookies(["language"]);
    let minTemperature = 0;
    let maxTemperature = Math.floor(Math.max.apply(Math, props.dataTemperature) + 3);
    let minPercipitation = 0;
    let maxPercipitation = 10;

    let minTemperatureCalculated = Math.floor(Math.min.apply(Math, props.dataTemperature));
    if (minTemperatureCalculated < 0) {
        minTemperature = minTemperatureCalculated - 2;
    }

    let maxPercipitationCalculated = Math.ceil(Math.max.apply(Math, props.dataPrecipitation));
    if (maxPercipitationCalculated > maxPercipitation) {
        maxPercipitation = maxPercipitationCalculated + 2;
    }

    function getSVGImage(weatherCode) {
        var img = new Image();
        img.src = weatherIcons["weatherSVGIcons"][weatherCode.toString()];
        return img;
    }

    function getWeatherImagesSVG(weatherStates) {
        let weatherImages = [];
        weatherStates.map((st) => {
            weatherImages.push(getSVGImage(st));
        });
        return weatherImages;
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: props.graphTitle,
                font: {
                    size: 30,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";

                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.label == languages[cookies.language]["temperature"]) {
                                label += context.parsed.y + "°C";
                                label = [label];
                                label.push(
                                    languages[cookies.language]["weather"] +
                                        ": " +
                                        languages[cookies.language]["weatherCodes"][props.weatherState[context.dataIndex].toString()]
                                );
                            } else if (context.dataset.label == languages[cookies.language]["precipitation"]) label += context.parsed.y + " mm";
                            else label += context.parsed.y;
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                min: minTemperature,
                max: maxTemperature,
                title: {
                    display: true,
                    text: languages[cookies.language]["temperature"] + " [°C]",
                },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
                min: minPercipitation,
                max: maxPercipitation,
                title: {
                    display: true,
                    text: languages[cookies.language]["precipitation"] + " [mm]",
                },
            },
        },
    };

    const labels = [];
    let langExpanded = "sl-SI";
    if (cookies.language == "en") langExpanded = "en-GB";
    if (props.xAxisFormat == "full") {
        props.labels.map((lab) => {
            var date = new Date(lab);
            var options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
            labels.push(Intl.DateTimeFormat(langExpanded, options).format(date));
        });
    } else {
        props.labels.map((lab) => {
            var date = new Date(lab);
            var options = { hour: "numeric", minute: "numeric" };
            labels.push(Intl.DateTimeFormat(langExpanded, options).format(date));
        });
    }

    const data = {
        labels,
        datasets: [
            {
                type: "line",
                label: languages[cookies.language]["temperature"],
                data: props.dataTemperature,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.5,
                yAxisID: "y",
                pointStyle: getWeatherImagesSVG(props.weatherState),
            },
            {
                type: "bar",
                label: languages[cookies.language]["precipitation"],
                backgroundColor: "rgb(135,206,235)",
                data: props.dataPrecipitation,
                borderColor: "white",
                borderWidth: 2,
                yAxisID: "y1",
            },
        ],
    };

    return <Chart type="bar" options={options} data={data} />;
}
export default LineChart;
