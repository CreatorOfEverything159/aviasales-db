import React, {useEffect, useState} from 'react'
import {cancelFlight, createFlight, getAllFlights, searchFlightByNumber} from '../http/flightsAPI'
import {Button, Col, Container, Form, Modal, Row, Table} from 'react-bootstrap'
import {passengersByFlight} from '../http/userAPI'

const Operator = () => {
    const [flights, setFlights] = useState([])
    const [number, setNumber] = useState('')
    const [flightNumber, setFlightNumber] = useState('')
    const [departureAirport, setDepartureAirport] = useState('')
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().slice(0, 16))
    const [destinationAirport, setDestinationAirport] = useState('')
    const [seatsAmount, setSeatsAmount] = useState(50)
    const [passengers, setPassengers] = useState([])
    const [flight, setFlight] = useState({})
    const [modalShow, setModalShow] = useState(false)
    const [searchDepartureDate, setSearchDepartureDate] = useState(new Date().toISOString().slice(0, 10))

    useEffect(() => {
        getAllFlights()
            .then(data => {
                setFlights(data)
            })
    }, [])

    const formatter = new Intl.DateTimeFormat("ru", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    })

    const cancel = async (id) => {
        try {
            const data = await cancelFlight(id)
            alert(data.message)
            getAllFlights().then(data => {
                setFlights(data)
            })
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const setBtn = (flight) => {
        const dateNow = new Date()
        if (flight.isActive && new Date(flight.departureDate) <= dateNow) {
            return <Button disabled variant="danger">Отменить</Button>
        } else if (flight.isActive) {
            return <Button
                onClick={() => cancel(flight.id)}
                variant="danger">Отменить</Button>
        } else {
            return <Button disabled variant="danger">Отменить</Button>
        }
    }

    const setFlightStatus = (flight) => {
        const dateNow = new Date()
        if (flight.isActive && new Date(flight.departureDate) <= dateNow) {
            return 'Совершен'
        } else if (flight.isActive) {
            return 'Ожидается'
        } else if (!flight.isActive) {
            return 'Отменен'
        }
    }

    const search = () => {
        searchFlightByNumber(number, searchDepartureDate)
            .then(data => setFlights(data))
    }

    const create = async () => {
        try {
            const data = await createFlight(flightNumber, departureAirport, destinationAirport, departureDate, seatsAmount)
            alert(data.message)

            getAllFlights()
                .then(data => {
                    setFlights(data)
                })
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const detail = async (flight) => {
        try {
            const data = await passengersByFlight(flight.id)
            setPassengers(data)
            setFlight(flight)
            setModalShow(true)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const MyVerticallyCenteredModal = (props) => {
        const formatter = new Intl.DateTimeFormat("ru", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        })

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Пасажиры
                        рейса {props?.flight?.number} ({props?.flight?.departureDate ? formatter.format(new Date(props.flight.departureDate)) : ''})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Серия и номер паспорта</th>
                            <th>ФИО</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.passengers.map((passenger, index) => {
                                return (
                                    <tr key={passenger.passport}>
                                        <td>{index + 1}</td>
                                        <td>{passenger.passport}</td>
                                        <td>{passenger.fio}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </Table>

                </Modal.Body>
            </Modal>
        )
    }

    return (
        <>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель оператора</h1>
                <hr/>
            </Container>
            <Container style={{marginTop: 30}}>
                <h2 className="mt-4">Создание рейса</h2>
                <Form className="">
                    <Row className="p-2 d-flex">
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formFlightNumber">
                                <Form.Text className="text-muted">
                                    Номер рейса
                                </Form.Text>
                                <Form.Control
                                    value={flightNumber}
                                    isInvalid={!(flightNumber.length === 6 && /[A-Z]{2,}[0-9]{4,}/.test(flightNumber))}
                                    isValid={(flightNumber.length === 6) && /[A-Z]{2,}[0-9]{4,}/.test(flightNumber)}
                                    onChange={e => setFlightNumber(e.target.value
                                        .replace(/[a-z]/g, function (u) {
                                            return u.toUpperCase()
                                        }))}
                                    type="text"
                                    placeholder="Номер рейса"/>
                                <Form.Control.Feedback type="invalid">
                                    6 символов (AA0000)
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formDepartureAirport">
                                <Form.Text className="text-muted">
                                    Аэропорт вылета
                                </Form.Text>
                                <Form.Control
                                    value={departureAirport}
                                    isInvalid={!(departureAirport.length === 3 && /[A-Z]{3,}/.test(departureAirport))}
                                    isValid={(departureAirport.length === 3 && /[A-Z]{3,}/.test(departureAirport))}
                                    onChange={e => setDepartureAirport(e.target.value.replace(/[a-z]/g, function (u) {
                                        return u.toUpperCase()
                                    }))}
                                    type="text"
                                    placeholder="Аэропорт вылета"/>
                                <Form.Control.Feedback type="invalid">
                                    3 символа (AAA)
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formFlightNumber">
                                <Form.Text className="text-muted">
                                    Аэропорт назначения
                                </Form.Text>
                                <Form.Control
                                    value={destinationAirport}
                                    isInvalid={!(destinationAirport.length === 3 && /[A-Z]{3,}/.test(destinationAirport))}
                                    isValid={(destinationAirport.length === 3 && /[A-Z]{3,}/.test(destinationAirport))}
                                    onChange={e => setDestinationAirport(e.target.value.replace(/[a-z]/g, function (u) {
                                        return u.toUpperCase()
                                    }))}
                                    type="text"
                                    placeholder="Аэропорт назначения"/>
                                <Form.Control.Feedback type="invalid">
                                    3 символа (AAA)
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formSeatsAmount">
                                <Form.Text className="text-muted">
                                    Количество мест
                                </Form.Text>
                                <Form.Control
                                    value={seatsAmount}
                                    onChange={e => setSeatsAmount(e.target.value.replace(/[^0-9]/, ''))}
                                    isInvalid={!(seatsAmount >= 50 && seatsAmount <= 100)}
                                    isValid={(seatsAmount >= 50 && seatsAmount <= 100)}
                                    type="number"
                                    placeholder="Количество мест"/>
                                <Form.Control.Feedback type="invalid">
                                    От 50 до 100
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formDepartureDate">
                                <Form.Text className="text-muted">
                                    Дата вылета
                                </Form.Text>
                                <Form.Control
                                    value={departureDate}
                                    onChange={e => setDepartureDate(e.target.value)}
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    placeholder="Дата вылета"/>
                            </Form.Group>
                        </Col>
                        <Col md={1} style={{padding: '5px', alignSelf: 'end'}}>
                            <Button
                                disabled={!(
                                    (flightNumber.length === 6) && /[A-Z]{2,}[0-9]{4,}/.test(flightNumber)
                                    && (departureAirport.length === 3 && /[A-Z]{3,}/.test(departureAirport))
                                    && (destinationAirport.length === 3 && /[A-Z]{3,}/.test(destinationAirport))
                                    && (seatsAmount >= 50 && seatsAmount <= 100)
                                )}
                                onClick={create}>Создать</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Поиск рейсов</h2>
                <Form className="">
                    <Row className="p-2 d-flex">
                        <Col md={3} style={{padding: '5px'}}>
                            <Form.Group controlId="formDepartureCity">
                                <Form.Text className="text-muted">
                                    Номер рейса
                                </Form.Text>
                                <Form.Control
                                    value={number}
                                    onChange={e => setNumber(e.target.value)}
                                    type="text"
                                    placeholder="Номер рейса"/>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formDepartureDate">
                                <Form.Text className="text-muted">
                                    Дата вылета
                                </Form.Text>
                                <Form.Control
                                    value={searchDepartureDate}
                                    onChange={e => setSearchDepartureDate(e.target.value)}
                                    type="date"
                                    min={new Date().toISOString().slice(0, 10)}
                                    placeholder="Дата вылета"/>
                            </Form.Group>
                        </Col>
                        <Col md={3} style={{padding: '5px', alignSelf: 'end'}}>
                            <Button variant="success" onClick={search}>Поиск</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Рейсы</h2>
                {
                    flights.length !== 0
                        ? <Table className="mt-4">
                            <thead>
                            <tr>
                                <th>Номер рейса</th>
                                <th>Аэропорт вылета</th>
                                <th>Аэропорт назначения</th>
                                <th>Дата и время вылета</th>
                                <th>Количество мест</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                flights.map(flight => {
                                    return (
                                        <tr key={flight.id}>
                                            <td>{flight.number}</td>
                                            <td>{flight.departureAirport}</td>
                                            <td>{flight.destinationAirport}</td>
                                            <td>{formatter.format(new Date(flight.departureDate))}</td>
                                            <td>{flight.seatsAmount}</td>
                                            <td>{setFlightStatus(flight)}</td>
                                            <td>{setBtn(flight)}</td>
                                            <td><Button
                                                onClick={() => {
                                                    detail(flight)
                                                }}
                                            >Подробнее</Button></td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                        : 'Рейсов нет'
                }

            </Container>
            <MyVerticallyCenteredModal
                flight={flight}
                passengers={passengers}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
        </>
    )
}

export default Operator
