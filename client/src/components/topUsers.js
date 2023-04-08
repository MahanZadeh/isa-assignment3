import { useState, useEffect, useCallback } from "react";
import { apiGetTopUser } from "../api/pokeAPI";
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

function TopUsers() {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

    const [allUsers, setAllUsers] = useState([]);
    const [labels, setLabels]  = useState([]);
    const [accessCount, setAccessCount] = useState([]);
    const [chartData, setChartData] = useState({datasets:[]});
    const [currentDate, setDate] = useState(new Date().toISOString().substring(0, 10));

    const grabAllUsers =  () => {
        apiGetTopUser(currentDate)
        .then(res => res.data)
        .then(res => setAllUsers(res))
        .catch(err => console.log(err));
    };

    const makeLabels = () => {
        setLabels([...allUsers.map(entry => entry.userName)]);        
    };

    const makeAccessCount = () => {
        setAccessCount([...allUsers.map(entry => entry.accessCount)]);
    };

    const constructBarGraphData = (allLabels, allValues) => {
        setChartData({
            labels: allLabels,
            datasets: [
                {   
                label: "Top API users on " + currentDate ,
                data: allValues,
                backgroundColor: "red",
            }
        ]
    }
        );
    };

    useEffect(()=> {
        grabAllUsers();
    }, []);

    useEffect(() => {
        makeLabels();
        makeAccessCount();
    }, [allUsers]);

    useEffect(() => {
        constructBarGraphData(labels, accessCount)
    }, [labels, accessCount]);

    return(
        <Bar data={chartData}/>
    );
};

export default TopUsers;