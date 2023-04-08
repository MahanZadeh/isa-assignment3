import { useState, useEffect } from "react";
import { apiErrorCount } from "../api/pokeAPI";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

function ErrorEndpoints () {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const [apiErrors, setAPIErrors] = useState([]);
    const [routeCount, setRouteCount] = useState({});
    const [chartData, setChartData] = useState({datasets:[]});

    const grabErrorEndpoints = () => {
        apiErrorCount()
        .then(res => res.data)
        .then(res => {console.log(res); setAPIErrors(res)})
        .catch(err => console.log(err))

        console.log()
    };


    const calculateErrors = () => {
        var routeErrors = {};

        apiErrors.map(entry => {
            if (entry.status >= 400) {
                if (routeErrors[entry.endpoint]) {
                    routeErrors[entry.endpoint] += 1;
                } else {
                    routeErrors[entry.endpoint] = 1;
                }
            }
        });

        setRouteCount(routeErrors);
        console.log(routeErrors);
    };

    const constructBarGraphData = () => {
        setChartData({
            labels: Object.keys(routeCount).map(entry => entry),
            datasets: [
                {   
                label: "4xx Errors by Route",
                data: Object.values(routeCount).map(entry => entry),
                backgroundColor: "Orange",
            }
        ]
    }
        );
    };

    useEffect(() => {
        grabErrorEndpoints();
    }, []);

    useEffect(() => {
        calculateErrors();
    }, [apiErrors]);

    useEffect(() => {
        constructBarGraphData()
    }, [routeCount]);

    return(
        <Bar data={chartData}/>
        )

}

export default ErrorEndpoints;