import React, {useEffect, useState} from 'react'
import {Button, Container, Table} from "react-bootstrap";
import {getAllFlights} from '../http/flightsAPI'
import {useDispatch, useSelector} from 'react-redux'
import {addAllFlights} from '../store/actions/flights'

const Flights = () => {

    const dispatch = useDispatch()
    const [flights, setFlights] = useState([])

    const addFlights = (flights) => {
        dispatch(addAllFlights(flights))
    }

    const stateFlights = useSelector(state => state.flightReducer)

    useEffect(() => {
        getAllFlights()
            .then(data => {
                setFlights(data)
                addFlights(data)
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

    return (
        <Container>
            <h1 className="mt-4">Рейсы</h1>
            <Table className="mt-4">
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
                    flights.map((flight) => {
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
                                        <Button disabled>Забронировать</Button>
                                    </td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
            </Table>
        </Container>
    )
}

export default Flights
