import Pokemon from "./pokemon";
import { Col, Container, Row, Card, Button} from "react-bootstrap";
import { useState } from "react";
import '../styles/PokemonPage.css';
import { apiGetSinglePokemon } from "../api/pokeAPI";


function PokemonPage({ currentPokemon, currentPage }) {

    const [ individualPoke, setIndividualPoke ] = useState("");

    const getMoreInfo = async (pokeID) => {
        apiGetSinglePokemon(pokeID)
        .then(res => res.data)
        .then(res => {
          setIndividualPoke(res);
        })
        .catch(err => console.log(err));
        renderMoreInfo(individualPoke[0]);
    };

    const formatExtraInformation = (singlePoke) => {
        return (
          <div className="extra-info">
            <Card.Text>{singlePoke.type.map((item) => ' ' + item)}</Card.Text>
            <Card.Text></Card.Text>
            <Card.Text>HP: {singlePoke.base.HP}</Card.Text>
            <Card.Text>Attack: {singlePoke.base.Attack}</Card.Text>
            <Card.Text>Defence: {singlePoke.base.Defense}</Card.Text>
          </div>
        );
      };
      
      

      const renderBasicCard = (item) => {
        return (
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>{item.name.english}</Card.Title>
            <Pokemon key={item.id} pokemon={item} />
            <div className="button-container">
              <Button
                className="button-style"
                variant="info"
                size="sm"
                onClick={() => getMoreInfo(item.id)}
              >
                Learn More
              </Button>
            </div>
          </Card.Body>
        );
      };
      
      const renderMoreInfo = (singlePoke) => {
        return (
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>{singlePoke.name.english}</Card.Title>
            {formatExtraInformation(singlePoke)}
            <div className="button-container">
              <Button
                className="button-style"
                variant="info"
                size="sm"
                onClick={() => setIndividualPoke("")}
              >
                Minimize
              </Button>
            </div>
          </Card.Body>
        );
      };
      

    return(
        <div> 



        <Container>        
        <Row xs={2} md={5}>
        {currentPokemon.map(item => (
                <Col>
                    <Card>
                        { individualPoke && individualPoke[0].id === item.id ? renderMoreInfo(item) : renderBasicCard(item)}

                    </Card>
                </Col>
            ))}
        </Row>
    </Container>

    </div>
    );
};

export default PokemonPage;