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
