import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Button, Container, Table} from 'react-bootstrap'
import {ticketAdder, ticketRemover} from '../http/ticAPIkets'
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
        if (stateUser.auth) {
            if (stateUser.userRole === 'Пассажир') {
                if (flightsIds.includes(flight.id)) {
                    return <Button
                        onClick={() => {removeTicket(flight.id)}}
                        variant="danger">Отменить бронь</Button>
                }
                return <Button
                    onClick={() => {addTicket(flight.id)}}
                    variant="warning">Забронировать</Button>
            } else {
                return <Button disabled variant="warning">Забронировать</Button>
            }
        } else {
            return <Button disabled variant="warning">Забронировать</Button>
        }
    }

    return (
        <>
            <Container>
                <h1 className="mt-4">Забронированные билеты</h1>
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
                                <th>Количество мест</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                flights.map(flight => {
                                        if (stateUser.tickets.find(ticket => ticket.flightId === flight.id))
                                            return (
                                                <tr key={flight.id}>
                                                    <td>{flight.number}</td>
                                                    <td>{flight.departureCity}</td>
                                                    <td>{flight.destinationCity}</td>
                                                    <td>{flight.departureAirport}</td>
                                                    <td>{flight.destinationAirport}</td>
                                                    <td>{formatter.format(new Date(flight.departureDate))}</td>
                                                    <td>{flight.seatsAmount}</td>
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
