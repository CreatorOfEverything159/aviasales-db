import React from 'react'
import {Button, Container, Nav, Navbar, NavLink} from 'react-bootstrap'
import {ADMIN_ROUTE, FLIGHTS_ROUTE, LOGIN_ROUTE, OPERATOR_ROUTE, PASSENGER_ROUTE} from "../utils/consts";
import {useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {removeUser} from '../store/actions/user'

const Navigation = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const stateUser = useSelector(state => state.userReducer)

    const removeLogoutUser = (user) => {
        dispatch(removeUser(user))
    }

    const click = () => {
        if (stateUser.userRole === 'Администратор') {
            navigate(ADMIN_ROUTE)
        } else if (stateUser.userRole === 'Оператор') {
            navigate(OPERATOR_ROUTE)
        } else if (stateUser.userRole === 'Пассажир') {
            navigate(PASSENGER_ROUTE)
        }
    }

    const logOut = () => {
        removeLogoutUser({
            auth: false,
            login: null,
            userRole: null,
            passengerPassport: null,
            fio: null,
            tickets: []
        })
        navigate(FLIGHTS_ROUTE)
    }

    const authButton = () => {
        if (stateUser.auth) {
            if (![ADMIN_ROUTE, OPERATOR_ROUTE, PASSENGER_ROUTE].includes(location.pathname)) {
                return (
                    <Nav>
                        <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={click}
                        >Личный кабинет</Button>
                    </Nav>
                )
            } else {
                return (
                    <Button
                        variant="outline-danger"
                        className="me-2"
                        onClick={logOut}
                    >Выйти</Button>
                )
            }
        } else if (location.pathname !== LOGIN_ROUTE) {
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
        }
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
