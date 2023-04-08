import React from 'react';
import "../styles/app.css"
import { CardImg } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Pokemon( {pokemon } ) {
    
    const searchParam = (id) => {
        const theID = "" + id;
        const padded = theID.padStart(3, "0")
        return "https://github.com/fanzeyi/pokemon.json/raw/master/images/" + padded + ".png";
    };
    
    return(
        <CardImg className="photo" src={searchParam(pokemon.id)} />
    );
};

export default Pokemon;