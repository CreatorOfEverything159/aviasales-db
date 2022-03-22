import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button, Container, Table} from 'react-bootstrap'
import {ticketAdder, ticketRemover} from '../http/ticketsAPI'
import {setUser} from '../store/actions/user'
import {getAllFlights} from '../http/flightsAPI'

const Passenger = () => {
    const stateUser = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const [tickets, setTickets] = useState(stateUser.tickets)
    const [flights, setFlights] = useState([])
    // const flights = stateUser.tickets

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
        ticketAdder(flightId, stateUser.passengerPassport)
            .then(data => {
                stateUser.tickets.push(data)
                dispatch(setUser({tickets: [...stateUser.tickets]}))
            })
    }

    const removeTicket = (flightId) => {
        ticketRemover(flightId, stateUser.passengerPassport)
            .then(data => {
                stateUser.tickets.splice(stateUser.tickets.findIndex(ticket => ticket.flightId === flightId), 1)
                dispatch(setUser({tickets: [...stateUser.tickets]}))
            })
    }

    const setBtn = (flight) => {
        const flightsIds = stateUser.tickets.map(({flightId}) => flightId)
        const dateNow = new Date()
        if (stateUser.auth) {
            if (stateUser.userRole === 'Пассажир') {
                if (flightsIds.includes(flight.id) && new Date(flight.departureDate) <= dateNow) {
                    return <Button
                        onClick={() => {
                            removeTicket(flight.id)
                        }}
                        disabled
                        variant="danger">Отменить бронь</Button>
                } else if (flightsIds.includes(flight.id)) {
                    return <Button
                        onClick={() => {
                            removeTicket(flight.id)
                        }}
                        variant="danger">Отменить бронь</Button>
                } else if (!flightsIds.includes(flight.id) && new Date(flight.departureDate) <= dateNow) {
                    return <Button disabled variant="warning">Забронировать</Button>
                }
                if (!flight.isActive) {
                    return <Button disabled variant="warning">Забронировать</Button>
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

    return (
        <>
            <Container>
                <h2 className="mt-4">Забронированные билеты</h2>
                {
                    stateUser.tickets.length !== 0
                    ? <Table className="mt-4">
                            <thead>
                            <tr>
                                <th>Номер рейса</th>
                                <th>Город вылета</th>
                                <th>Город назначения</th>
                                <th>Аэропорт вылета</th>
                                <th>Аэропорт назначения</th>
                                <th>Дата и время вылета</th>
                                <th>Свободных мест</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                flights.map(flight => {
                                        if (stateUser.tickets.find(ticket => ticket.flightId === flight.id))
                                            return (
                                                <tr style={!flight.isActive ? {'color': 'red'} : {}} key={flight.id}>
                                                    <td>{flight.number}</td>
                                                    <td>{flight.departureCity}</td>
                                                    <td>{flight.destinationCity}</td>
                                                    <td>{flight.departureAirport}</td>
                                                    <td>{flight.destinationAirport}</td>
                                                    <td>{formatter.format(new Date(flight.departureDate))}</td>
                                                    <td>{flight.seatsAmount}</td>
                                                    <td>{setFlightStatus(flight)}</td>
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

export default Passenger
