import { Routes, Route, Link, NavLink, useParams, Outlet } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import * as React from "react";
import { useNavigate } from "react-router-dom";


const Header = () => {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.target[0].value)
        console.log("submit");
        navigate("/search/" + event.target[0].value);
    }
    return (
        <>
            <Navbar sticky="top" bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse className="Nav-items-container" id="navbarScroll">
                        <Nav
                            className="justify-content-start flex-grow-1 pe-3 custom-nav-wrapper"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <NavLink id="AnchorTag" className="nav-link" to="/">Home</NavLink>
                            

                        </Nav>
                        <Nav
                            className="justify-content-center flex-grow-1 pe-3 custom-nav-wrapper"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Form onSubmit={handleSubmit} className="d-flex">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                                <Button type="submit" variant="outline-success">Search</Button>
                            </Form>
                        </Nav>
                        <Nav
                            className="justify-content-end flex-grow-1 pe-3 custom-nav-wrapper"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <NavLink className="nav-link" to="/users"><img src="https://walkersarewelcome.org.uk/wp-content/uploads/computer-icons-google-account-icon-design-login-png-favpng-jFjxPac6saRuDE3LiyqsYTEZM.jpg" className="account-icon-style" ></img></NavLink>

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>);
};

export default Header;