import React, {useState} from 'react'
import {Button, Card, Container, Form, NavLink, Row} from 'react-bootstrap'
import {useLocation, useNavigate} from 'react-router-dom'
import {authorization, registration} from '../http/userAPI'
import {useDispatch} from 'react-redux'
import {setUser} from '../store/actions/user'
import {ADMIN_ROUTE, LOGIN_ROUTE, OPERATOR_ROUTE, PASSENGER_ROUTE, REGISTRATION_ROUTE} from '../utils/consts'

const Auth = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [fio, setFio] = useState('')
    const [passport, setPassport] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const setLoginUser = (user) => {
        dispatch(setUser(user))
    }

    const authorize = async () => {
        try {
            const data = await authorization(login, password)
            setLoginUser({auth: true, ...data})
            const userRole = data.userRole
            if (userRole === 'Администратор') {
                navigate(ADMIN_ROUTE)
            } else if (userRole === 'Оператор') {
                navigate(OPERATOR_ROUTE)
            } else if (userRole === 'Пассажир') {
                navigate(PASSENGER_ROUTE)
            }
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const reg = async () => {
        try {
            const data = await registration(login, password, 'Пассажир', fio, passport)
            alert(data.message)
            navigate(LOGIN_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    function capitalize(str) {
        return str.replace(/(^|\s)\S/g, function (a) {
            return a.toUpperCase()
        })
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-4">
                <h2 className="m-auto">{location.pathname !== REGISTRATION_ROUTE ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Group className="mb-3" controlId="formLogin">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control
                            placeholder="Логин"
                            value={login}
                            type="text"
                            isInvalid={!(login.length >= 4 && login.length <= 16)}
                            isValid={(login.length >= 4 && login.length <= 16)}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            От 4 до 16 символов
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            placeholder="Пароль"
                            value={password}
                            type="password"
                            isInvalid={!(password.length >= 4 && password.length <= 16)}
                            isValid={(password.length >= 4 && password.length <= 16)}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            От 4до 16 символов
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        {
                            location.pathname !== REGISTRATION_ROUTE
                                ? (
                                    <>
                                        <div className="d-flex align-items-center">
                                            Нет аккаунта? <NavLink href={REGISTRATION_ROUTE}>Зарегистрироваться</NavLink>
                                        </div>
                                        <Button
                                            variant="primary"
                                            className="mt-2"
                                            onClick={authorize}
                                            disabled={
                                                !((password.length >= 4 && password.length <= 16)
                                                    && (login.length >= 4 && login.length <= 16))
                                            }
                                        >Войти</Button>
                                    </>

                                )
                                : (
                                    <>
                                        <Form.Group className="mb-3" controlId="formFio">
                                            <Form.Label>ФИО</Form.Label>
                                            <Form.Control
                                                placeholder="ФИО"
                                                value={fio}
                                                type="text"
                                                isInvalid={!(fio.length >= 4 && fio.length <= 40)}
                                                isValid={(fio.length >= 4 && fio.length <= 40)}
                                                onChange={e => setFio(capitalize(e.target.value
                                                    .replace(/[^А-я ]/, '')
                                                    .replaceAll('  ', ' ')
                                                    .trimStart()))}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                От 4 до 40 символов
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formPassport">
                                            <Form.Label>Серия и номер паспорта</Form.Label>
                                            <Form.Control
                                                placeholder="Серия и номер паспорта"
                                                value={passport}
                                                type="text"
                                                isInvalid={!(passport.length === 10)}
                                                isValid={(passport.length === 10)}
                                                onChange={e => setPassport(e.target.value.replace(/[^0-9]/, '').replaceAll(' ', ''))}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                10 символов
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <>
                                            <div className="d-flex align-items-center">
                                                Есть аккаунт? <NavLink href={LOGIN_ROUTE}>Войти</NavLink>
                                            </div>
                                            <Button
                                                variant="primary"
                                                className="mt-2"
                                                onClick={reg}
                                                disabled={
                                                    !((fio.length >= 4 && fio.length <= 40)
                                                    && (passport.length === 10)
                                                    && (password.length >= 4 && password.length <= 16)
                                                    && (login.length >= 4 && login.length <= 16))
                                                }
                                            >Зарегистрироваться</Button>
                                        </>
                                    </>
                                )
                        }
                    </Form.Group>
                </Form>
            </Card>
        </Container>
    )
}

export default Auth
