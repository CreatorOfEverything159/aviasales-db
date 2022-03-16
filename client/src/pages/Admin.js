import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Form, Table} from "react-bootstrap";
import {getUser, getUsers, registration, removeUser, searchUser} from "../http/userAPI";

const Admin = () => {

    // const {user} = useContext(Context)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [userType, setUserType] = useState(2)

    const [findLogin, setFindLogin] = useState('')
    const [findType, setFindType] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalUser, setModalUser] = useState({})

    const [operators, setOperators] = useState([])

    useEffect(() => {
        getUsers('Оператор')
            .then(data => setOperators(data))
    }, [])

    const operatorReg = async () => {
        try {
            const data = await registration(login, password, 'Оператор')
            alert(data.message)
            getUsers('Оператор')
                .then(data => setOperators(data))
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
            removeUser(login, 'Оператор')
                .then(data => alert(data.message))
            getUsers('Оператор')
                .then(data => setOperators(data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const getOneUser = async (login) => {
        try {
            return await getUser(login)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель администратора</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Создать пользователя</h2>
                <Form className="">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationType">
                            <Form.Text className="text-muted">
                                Должность пользователя
                            </Form.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={userType}
                                onChange={e => setUserType(e.target.value)}
                            >
                                <option value="2">Менеджер</option>
                                <option value="3">Продавец-консультант</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationLogin">
                            <Form.Text className="text-muted">
                                Логин пользователя
                            </Form.Text>
                            <Form.Control
                                value={login}
                                type="text"
                                onChange={e => setLogin(e.target.value)}
                                placeholder="Логин"/>
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
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Пароль"/>
                        </Form.Group>
                    </Col>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            type="submit"
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
                        <th>Должность</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        operators.map((operator, index) => {
                                return (
                                    <tr key={operator.login}>
                                        <td>{index + 1}</td>
                                        <td>{operator.login}</td>
                                        <td>
                                            <Button className="me-4" variant="outline-warning" onClick={() => {
                                                getOneUser(operator.login)
                                                    .then(data => {
                                                    setModalUser(data)
                                                    setModalShow(true)
                                                })
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
            {/*<MyVerticallyCenteredModal user={modalUser} show={modalShow} onHide={() => setModalShow(false)} />*/}
        </>
    )
}

export default Admin
