import React from 'react'
import {Container, Nav, Navbar, NavLink} from 'react-bootstrap'
import {FLIGHTS_ROUTE} from "../utils/consts";

const Navigation = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand>Авиасэйлс</Navbar.Brand>
                <Nav className="me-auto">
                    <NavLink href={FLIGHTS_ROUTE}>Рейсы</NavLink>
                </Nav>
                {
                    // navbarButtons()
                }
            </Container>
        </Navbar>
    )
}

export default Navigation
