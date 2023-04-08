import { useState, useEffect } from "react";
import { apiErrorCount } from "../api/pokeAPI";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function RecentErrors () {

    const [apiRoutes, setAPIRoutes] = useState([]);
    const [errorRoutes, setErrorRoutes] = useState([]);
    const [rows, setRows] = useState([]);

    const grabErrorEndpoints = () => {
        apiErrorCount()
        .then(res => res.data)
        .then(res => setAPIRoutes(res))
        .catch(err => console.log(err))
    };

    const parseRecentErrors = () => {
        var allErrors = [];

        apiRoutes.map(entry => {
            if (entry.status >= 400){
                allErrors.push(entry);
            }
        });
        console.log(allErrors);
        setErrorRoutes(allErrors);
    };

    const constructRows = () => {
        let newRows = [];

        errorRoutes.map(entry => {
            newRows.push({
                "method": entry.method,
                "endpoint": entry.endpoint,
                "status": entry.status,
                "date": entry.date,
            });
        });

        setRows(newRows);
    };

    useEffect(() => {
        grabErrorEndpoints();
    }, []);

    useEffect(() => {
        parseRecentErrors();
    }, [apiRoutes]);

    useEffect(() => {
        constructRows();
    }, [errorRoutes]);

    return(
        <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Endpoints</TableCell>
              <TableCell align="right">Method</TableCell>
              <TableCell align="right">Error Code</TableCell>
              <TableCell align="right">Date</TableCell>
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
                <TableCell align="right">{row.method}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
};

export default RecentErrors;