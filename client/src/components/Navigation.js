import React from 'react'
import {Button, Container, Nav, Navbar, NavLink} from 'react-bootstrap'
import {FLIGHTS_ROUTE, LOGIN_ROUTE} from "../utils/consts";
import {useLocation, useNavigate} from 'react-router-dom'

const Navigation = () => {

    const click = () => {
        // if (user.typeId === 1) {
        //     navigate(ADMIN_ROUTE)
        // } else if (user.typeId === 2) {
        //     navigate(MANAGER_ROUTE)
        // } else if (user.typeId === 3) {
        //     navigate(SALESMAN_ROUTE)
        // } else if (user.typeId === 4) {
        //     navigate(SUBSCRIBER_ROUTE)
        // }
    }

    const navigate = useNavigate()
    const location = useLocation()

    const authButton = () => {
        // if (user.isAuth) {
        //     if (![ADMIN_ROUTE, MANAGER_ROUTE, SALESMAN_ROUTE, SUBSCRIBER_ROUTE].includes(location.pathname)) {
        //         return (
        //             <Nav>
        //                 <Button
        //                     variant="outline-primary"
        //                     className="me-2"
        //                     onClick={click}
        //                 >Личный кабинет</Button>
        //             </Nav>
        //         )
        //     } else {
        //         return (
        //             <Button
        //                 variant="outline-danger"
        //                 className="me-2"
        //                 onClick={logOut}
        //             >Выйти</Button>
        //         )
        //     }
        // } else if (location.pathname !== LOGIN_ROUTE) {
            return (
                <Nav>
                    <Button
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => {
                            navigate(LOGIN_ROUTE)
                        }}
                    >Авторизация</Button>
                </Nav>)
        // }
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand>Авиасэйлс</Navbar.Brand>
                <Nav className="me-auto">
                    <NavLink href={FLIGHTS_ROUTE}>Рейсы</NavLink>
                </Nav>
                {
                    authButton()
                }
            </Container>
        </Navbar>
    )
}

export default Navigation
