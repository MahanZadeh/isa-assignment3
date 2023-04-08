import { useEffect, useState } from "react";
import PokemonPage from "../components/pokemonComponent";
import Pagination from "../components/pagination";
import TypeBox from "../components/typeBoxes";
import { useNavigate } from "react-router-dom";
import { apiGetAllPokemon } from "../api/pokeAPI";
import withBasicAuth from "../components/withBasicAuth";
import { Button, NavDropdown, Navbar } from "react-bootstrap";
import { apiLogout } from "../api/pokeAPI";

function App() {

  const [pokemon, setPokemon] = useState([]);
  const [filters, setFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(10);

  const navigate = useNavigate();

  const getPokemon = async () => {

    apiGetAllPokemon()
      .then(res => res.data)
      .then(data => {
        console.log(data);
        data = data.filter(poke => filters.every((filter) => poke.type.includes(filter)))
        return data;
      })
      .then(res => {
        setPokemon(res)
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getPokemon();
  }, [filters]);

  var lastRecord = currentPage * pokemonPerPage;
  var firstRecord = lastRecord - pokemonPerPage;
  var currentPokemon = pokemon.slice(firstRecord, lastRecord);
  var numOfPages = Math.ceil(pokemon.length / pokemonPerPage);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">PokeApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavDropdown title="Menu" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={async () => {
              await apiLogout();
              navigate("/login");
            }}>
              Logout
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => navigate("/adminlogin")}>
              Analytics
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Navbar>
      <div className="app-container">
        <TypeBox currentFilters={filters} setFilters={setFilter} />

        <PokemonPage currentPokemon={currentPokemon} currentPage={currentPage} />

        <Pagination numPages={numOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </>
  );
}

export default withBasicAuth(App);
