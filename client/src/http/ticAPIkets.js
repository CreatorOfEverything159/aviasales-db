import {$authHost, $host} from './index'
import React from 'react'

export const ticketRemover = async (
    flightId,
    passengerPassport
) => {
    const {data} = await $authHost.post(
        'api/ticket/remove',
        {
            flightId,
            passengerPassport
        })
    return data
}

export const ticketAdder = async (
    flightId,
    passengerPassport
) => {
    const {data} = await $authHost.post(
        'api/ticket/add',
        {
            flightId,
            passengerPassport
        })
    return data
}