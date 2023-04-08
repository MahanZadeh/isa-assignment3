import { useState, useEffect } from "react";
import { apiGetUniqueUsers } from "../api/pokeAPI";
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
const moment = require('moment');

function UniqueUsers() {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    var today = new Date();
    var yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");

    const [dateRange, setDateRange] = useState({
        startDate: yesterday,
        endDate: today.toISOString().substring(0, 10)
    });

    const [usersByDate, setUsersByDate] = useState([]);
    const [dateLabels, setDateLabels] = useState([]);
    const [chartData, setChartData] = useState({datasets:[]});
    const [numUniqueUsers, setNumUniqueUsers] = useState([]);

    const grabUniqueUsers = () => {
        apiGetUniqueUsers(dateRange)
        .then(res => res.data)
        .then(res => setUsersByDate(res))
        .catch(err => console.log(err));
    };

    const makeDateLabels = () => {

        var daysUsed = [];
        usersByDate.map(entry => {
            if (!daysUsed.includes(entry.date)){
                daysUsed.push(entry.date);
            }
        });
        setDateLabels(daysUsed);
    };

    const makeNumUniqueUsers = () => {
        var uniqueUsers = [];
        usersByDate.map( entry => {
            var userCount = 0;
            entry.stats.map(() => {
                userCount +=1
            });
            uniqueUsers.push(userCount);
        })
        setNumUniqueUsers(uniqueUsers);
    };

    const constructBarGraphData = (allLabels, allValues) => {
        setChartData({
            labels: allLabels,
            datasets: [
                {   
                label: "Unique Users Between  " 
                + dateRange.startDate 
                + " and " + dateRange.endDate,
                data: allValues,
                backgroundColor: "blue",
            }
        ]
    }
        );
    };

    useEffect(() => {
        grabUniqueUsers();
    }, []);

    useEffect(() => {
        makeDateLabels();
        makeNumUniqueUsers();
    }, [usersByDate]);

    useEffect(() => {
        constructBarGraphData(dateLabels, numUniqueUsers)
    }, [dateLabels, numUniqueUsers]);

    return(
        <Bar data={chartData}/>
        );
}

export default UniqueUsers;