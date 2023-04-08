import { useState, useEffect } from "react";
import { apiEndpointUsers } from "../api/pokeAPI";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const lodash = require('lodash');


function Endpoints() {

    const [rows, setRows] = useState([]);
    const [apiEndpoint, setAPIEndpoints] = useState([]);
    const [labels, setLabels] = useState([]);
    const [topUser, setTopUser] = useState([]);
    const [visitCount, setVisitCount] = useState([]);

    function createData(endpoint, user, visits) {
        return { endpoint, user, visits };
      }

    const constructRows = () => { 
        let rows = [];
        let data = lodash.zip(labels, topUser, visitCount);
        
        data.map(entry => {
            rows.push(createData(entry[0], entry[1], entry[2]));
        })
        console.log(rows);
        setRows(rows);
    }
      
    const grabTopUsersByEndPoint = () => {
        apiEndpointUsers()
        .then(res => res.data)
        .then(res => setAPIEndpoints(res))
        .catch(err => console.log(err))
    }

    const makeEndpointLabels = () => {
        setLabels([...apiEndpoint.map(entry => entry.endpoint)]);
    }

    const getTopUsers = () => {
        var currentTop = [];
        var currentVisits = [];
       
        apiEndpoint.map(entry => {
            var currentTopUser;
            var currentTopVisit = 0;
            entry.access.map( 
            user => {
                if (user.count > currentTopVisit){
                    currentTopVisit = user.count;
                    currentTopUser = user.user;
                }
            })
            currentTop.push(currentTopUser);
            currentVisits.push(currentTopVisit);
        }
    )
    console.log(currentTop);
    console.log(currentVisits);
    setTopUser([...topUser, ...currentTop]);
    setVisitCount([...visitCount, ...currentVisits]);
    };

    useEffect(()=>{
        grabTopUsersByEndPoint();
        setTopUser([]);
        setVisitCount([]);
    }, []);

    useEffect(()=>{
        makeEndpointLabels();
        getTopUsers();
        constructRows();
    }, [apiEndpoint]);

    return(
        <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Endpoints</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Visit Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.endpoint}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.endpoint}
                </TableCell>
                <TableCell align="right">{row.user}</TableCell>
                <TableCell align="right">{row.visits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )

}

export default Endpoints;