import React, {useEffect, useState} from 'react'
import {cancelFlight, getAllFlights, searchFlights} from "../http/flightsAPI";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {ticketAdder, ticketRemover} from "../http/ticketsAPI";
import {setUser} from "../store/actions/user";
import {useDispatch, useSelector} from "react-redux";

const Operator = () => {
    const dispatch = useDispatch()
    const [flights, setFlights] = useState([])
    const [searchDepartureCity, setSearchDepartureCity] = useState('')
    const [searchDestinationCity, setSearchDestinationCity] = useState('')
    const [searchDepartureDate, setSearchDepartureDate] = useState(new Date().toISOString().slice(0, 10))
    const stateUser = useSelector(state => state.userReducer)

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
        minute: "numeric",
        timeZone: "Europe/Moscow"
    })

    const cancel = async (id) => {
        try {
            const data = await cancelFlight(id)
            alert(data.message)
            getAllFlights().then(data => {setFlights(data)})
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
        searchFlights(searchDepartureCity, searchDestinationCity, searchDepartureDate)
            .then(data => setFlights(data))
    }

    return (
        <>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель оператора</h1>
                <hr/>
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
                                    value={searchDepartureCity}
                                    onChange={e => setSearchDepartureCity(e.target.value)}
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
                                <th>Город вылета</th>
                                <th>Город назначения</th>
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
                                            <td>{flight.departureCity}</td>
                                            <td>{flight.destinationCity}</td>
                                            <td>{flight.departureAirport}</td>
                                            <td>{flight.destinationAirport}</td>
                                            <td>{formatter.format(new Date(flight.departureDate))}</td>
                                            <td>{flight.seatsAmount}</td>
                                            <td>{setFlightStatus(flight)}</td>
                                            <td>{setBtn(flight)}</td>
                                            <td><Button
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
        </>
    )
}

export default Operator
