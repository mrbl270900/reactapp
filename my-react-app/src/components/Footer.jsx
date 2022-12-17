import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {NavLink} from "react-router-dom";


const Footer = () =>
    <footer className="page-footer">
        <Container fluid className="FooterConstainer-styles">
            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <h2>Group 7's AMAZING app</h2>
                            </Col>
                            <Col>
                                <h2>Maybe some links?</h2>
                                <NavLink className="nav-link" to="/">Home</NavLink>
                                <NavLink className="nav-link" to="/movies/0/25">Movies</NavLink>
                                <NavLink className="nav-link" to="/persons/0/25">Persons</NavLink>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>

</footer>

export default Footer