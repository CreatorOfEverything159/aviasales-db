import React, {useEffect, useState} from 'react'
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap'
import {getAllFlights, searchFlights} from '../http/flightsAPI'
import {useDispatch, useSelector} from 'react-redux'
import {ticketAdder, ticketRemover} from '../http/ticAPIkets'
import {setUser} from '../store/actions/user'

const Flights = () => {
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
        minute: "numeric"
    })

    const addTicket = (flightId) => {
        try {
            ticketAdder(flightId, stateUser.passengerPassport)
                .then(data => {
                    stateUser.tickets.push(data)
                    dispatch(setUser({tickets: [...stateUser.tickets]}))
                })
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const removeTicket = (flightId) => {
        try {
            ticketRemover(flightId, stateUser.passengerPassport)
                .then(data => {
                    stateUser.tickets.splice(stateUser.tickets.findIndex(ticket => ticket.flightId === flightId), 1)
                    dispatch(setUser({tickets: [...stateUser.tickets]}))
                })
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const setBtn = (flight) => {
        const flightsIds = stateUser.tickets.map(({flightId}) => flightId)
        if (stateUser.auth) {
            if (stateUser.userRole === 'Пассажир') {
                if (flightsIds.includes(flight.id)) {
                    return <Button
                        onClick={() => {
                            removeTicket(flight.id)
                        }}
                        variant="danger">Отменить бронь</Button>
                }
                return <Button
                    onClick={() => {
                        addTicket(flight.id)
                    }}
                    variant="warning">Забронировать</Button>
            } else {
                return <Button disabled variant="warning">Забронировать</Button>
            }
        } else {
            return <Button disabled variant="warning">Забронировать</Button>
        }
    }

    const search = () => {
        searchFlights(searchDepartureCity, searchDestinationCity, searchDepartureDate)
            .then(data => setFlights(data))
    }

    return (
        <>
            <Container>
                <h1 className="mt-4">Поиск билетов</h1>
                <Form className="">
                    <Row className="p-2 d-flex">
                        <Col md={3} style={{padding: '5px'}}>
                            <Form.Group controlId="formDepartureCity">
                                <Form.Text className="text-muted">
                                    Город вылета
                                </Form.Text>
                                <Form.Control
                                    value={searchDepartureCity}
                                    onChange={e => setSearchDepartureCity(e.target.value)}
                                    type="text"
                                    placeholder="Город вылета"/>
                            </Form.Group>
                        </Col>
                        <Col md={3} style={{padding: '5px'}}>
                            <Form.Group controlId="formDestinationCity">
                                <Form.Text className="text-muted">
                                    Город назначения
                                </Form.Text>
                                <Form.Control
                                    value={searchDestinationCity}
                                    onChange={e => setSearchDestinationCity(e.target.value)}
                                    type="text"
                                    placeholder="Город назначения"/>
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
                <h1 className="mt-4">Рейсы</h1>
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
                                                <td>{flight.isActive ? 'Ожидается' : 'Отменен'}</td>
                                                <td>
                                                    {
                                                        setBtn(flight)
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                            </tbody>
                        </Table>
                        : 'Рейсов нет'
                }

            </Container>
        </>
    )
}

export default Flights
