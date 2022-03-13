import {$authHost, $host} from './index'

export const getAllFlights = async () => {
    const {data} = await $host.get('api/flight')
    return data
}