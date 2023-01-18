import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import languages from "./../data/languages.json";
import React, { useState, useEffect } from "react";
import Flag from "react-flagkit";
import { useCookies } from "react-cookie";

function Navigation() {
    //const [language, setCurrentLanguage] = useState("sl");
    const [cookies, setCookie, removeCookie] = useCookies(["language"]);
    if (cookies.language == null) {
        setCookie("language", "sl", { path: "/" });
    }

    useEffect(() => {}, [cookies]);

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">{languages[cookies.language]["weatherForecast"]}</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/favorite">{languages[cookies.language]["favorite"]}</Nav.Link>
                        {/* <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                </Navbar.Collapse>
                <Nav.Item className="ml-auto">
                    <Flag
                        country="SI"
                        role="button"
                        onClick={() => {
                            setCookie("language", "sl", { path: "/" });
                        }}
                    />
                    &nbsp; &nbsp;
                    <Flag
                        country="GB"
                        role="button"
                        onClick={() => {
                            setCookie("language", "en", { path: "/" });
                        }}
                    />
                </Nav.Item>
            </Container>
        </Navbar>
    );
}

export default Navigation;
