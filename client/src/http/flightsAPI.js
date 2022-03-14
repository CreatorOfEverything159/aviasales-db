import {$authHost, $host} from './index'
import React from 'react'

export const getAllFlights = async () => {
    const {data} = await $host.get('api/flight')
    return data
}

export const searchFlights = async (departureCity, destinationCity, departureDate) => {
    const {data} = await $host.post('api/flight/search', {departureCity, destinationCity, departureDate})
    return data
}