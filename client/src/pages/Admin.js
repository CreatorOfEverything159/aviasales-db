import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Form, Modal, Table} from 'react-bootstrap'
import {changeUser, getUser, getUsers, removeUser, searchUser, userRegistration} from '../http/userAPI'
import {useDispatch, useSelector} from 'react-redux'
import {setUser} from '../store/actions/user'

const Admin = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [findLogin, setFindLogin] = useState('')
    const [operators, setOperators] = useState([])

    const [modalShow, setModalShow] = useState(false)
    const [modalUser, setModalUser] = useState({})

    useEffect(() => {
        getUsers('Оператор')
            .then(data => setOperators(data))
    }, [])

    const operatorReg = async () => {
        try {
            const data = await userRegistration(login, password, 'Оператор')
            alert(data.message)
            const users = await getUsers('Оператор')
            setOperators(users)
            setLogin('')
            setPassword('')
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const searchOperator = async (findLogin, findType) => {
        try {
            searchUser(findLogin, findType)
                .then(data => setOperators(data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const removeOperator = async (login) => {
        try {
            const data = await removeUser(login, 'Оператор')
            alert(data.message)
            const operators = await getUsers('Оператор')
            setOperators(operators)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const MyVerticallyCenteredModal = (props) => {
        const [login, setLogin] = useState(props.user.login)
        const [password, setPassword] = useState(props.user.password)

        const formatter = new Intl.DateTimeFormat("ru", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        })

        const change = async () => {
            try {
                const data = await changeUser(props.user.login, login, password)
                alert(data.message)
                getUsers('Оператор')
                    .then(data => setOperators(data))

            } catch (e) {
                alert(e.response.data.message)
            }
        }

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Пасажиры
                        рейса {props?.flight?.number} ({props?.flight?.departureDate ? formatter.format(new Date(props.flight.departureDate)) : ''})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="">
                        <Col md={5} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegistrationLogin">
                                <Form.Text className="text-muted">
                                    Логин пользователя
                                </Form.Text>
                                <Form.Control type="text" value={login}
                                              onChange={(e) => setLogin(e.target.value)} placeholder="Логин"/>
                            </Form.Group>
                        </Col>
                        <Col md={5} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegistrationPassword">
                                <Form.Text className="text-muted">
                                    Пароль пользователя
                                </Form.Text>
                                <Form.Control value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                }} type="text" placeholder="Пароль"/>
                            </Form.Group>
                        </Col>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        change()
                        props.onHide()
                    }}>Сохранить изменения</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель администратора</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Создать оператора</h2>
                <Form className="">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationLogin">
                            <Form.Text className="text-muted">
                                Логин пользователя
                            </Form.Text>
                            <Form.Control
                                value={login}
                                type="text"
                                isInvalid={!(login.length >= 4 && login.length <= 16)}
                                isValid={(login.length >= 4 && login.length <= 16)}
                                onChange={e => setLogin(e.target.value)}
                                placeholder="Логин"/>
                            <Form.Control.Feedback type="invalid">
                                От 4 до 16 символов
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationPassword">
                            <Form.Text className="text-muted">
                                Пароль пользователя
                            </Form.Text>
                            <Form.Control
                                value={password}
                                type="password"
                                isInvalid={!(password.length >= 4 && password.length <= 16)}
                                isValid={(password.length >= 4 && password.length <= 16)}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Пароль"/>
                            <Form.Control.Feedback type="invalid">
                                От 4до 16 символов
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            disabled={
                                !((password.length >= 4 && password.length <= 16)
                                    && (login.length >= 4 && login.length <= 16))
                            }
                            onClick={operatorReg}>Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Поиск</h2>
                <Form className="d-flex align-items-end">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formLoginFinder">
                            <Form.Text className="text-muted">
                                Введите логин пользователя
                            </Form.Text>
                            <Form.Control value={findLogin} type="text" placeholder="Найти" onChange={(e) => {
                                setFindLogin(e.target.value)
                                searchOperator(e.target.value, 'Оператор')
                            }}/>
                        </Form.Group>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Таблица операторов</h2>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Логин</th>
                        <th>Пароль</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        operators.map((operator, index) => {
                                return (
                                    <tr key={operator.login}>
                                        <td>{index + 1}</td>
                                        <td>{operator.login}</td>
                                        <td>{operator.password}</td>
                                        <td>
                                            <Button className="me-4" variant="outline-warning" onClick={() => {
                                                setModalUser(operator)
                                                setModalShow(true)
                                            }}>Изменить</Button>
                                            <Button variant="outline-danger" onClick={() => {
                                                removeOperator(operator.login)
                                            }}>Удалить</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                    </tbody>
                </Table>
            </Container>
            <MyVerticallyCenteredModal
                user={modalUser}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
        </>
    )
}

export default Admin
