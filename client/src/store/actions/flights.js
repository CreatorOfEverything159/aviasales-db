import {ADD_ALL_FLIGHTS} from '../constants'

export const addAllFlights = flights => ({
    type: ADD_ALL_FLIGHTS,
    payload: flights
})