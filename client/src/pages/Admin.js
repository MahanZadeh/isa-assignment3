import { Col, Container, Row, Card, Button, Navbar, Nav, NavDropdown } from "react-bootstrap";
import ErrorEndpoints from "../components/errorsByEndpoint";
import RecentErrors from "../components/recentErrors";
import TopUsers from "../components/topUsers";
import UniqueUsers from "../components/uniqueUsers";
import Endpoints from "../components/usersByEndpoint";
import withAdminAuth from "../components/withAdminAuth";
import { apiLogout } from "../api/pokeAPI";
import { useNavigate } from "react-router-dom";
import '../styles/AdminPage.css';

function AdminPage() {
    const navigate = useNavigate();


    return (
        <div className="app-container">
          <div>
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">PokeApp</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item
                      onClick={async () => {
                        await apiLogout();
                        navigate("/login");
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate("/")}>
                      Homepage
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <h1 style={{ textAlign: "center" }}>Admin DashBoard</h1>
          </div>

            <Container>
                <Row>
                    <Col xs={12} md={8}>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Title style={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>
                                        Number of Errors by Endpoint
                                    </Card.Title>
                                    <ErrorEndpoints />
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Title style={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>
                                        Top API Users
                                    </Card.Title>
                                    <TopUsers />
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <Card.Title style={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>
                                        Unique Users Over the Last Two Days
                                    </Card.Title>
                                    <UniqueUsers />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} md={4}>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Title style={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>
                                        Error Logs
                                    </Card.Title>
                                    <RecentErrors />
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Title style={{ textAlign: "center", fontFamily: "Roboto", fontWeight: "bold" }}>
                                        Top User per Endpoint
                                    </Card.Title>
                                    <Endpoints />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default withAdminAuth(AdminPage);
