import {$authHost, $host} from './index'
import React from 'react'

export const getAllFlights = async () => {
    const {data} = await $authHost.get('api/flight')
    return data
}

export const searchFlights = async (departureCity, destinationCity, departureDate) => {
    const {data} = await $authHost.post('api/flight/search', {departureCity, destinationCity, departureDate})
    return data
}

export const cancelFlight = async (id) => {
    const {data} = await $authHost.post('api/flight/cancel', {id})
    return data
}

export const searchFlightByNumber = async (number, departureDate) => {
    const {data} = await $authHost.post('api/flight/searching', {number, departureDate})
    return data
}

export const createFlight = async (number, departureAirport, destinationAirport, departureDate, seatsAmount) => {
    const {data} = await $authHost.post('api/flight/create', {number, departureAirport, destinationAirport, departureDate, seatsAmount})
    return data
}
