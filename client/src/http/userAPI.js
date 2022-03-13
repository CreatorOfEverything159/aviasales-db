import {$authHost, $host} from './index'
import jwtDecode from 'jwt-decode'

export const authorization = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const registration = async (login, password, userRole = 'Пассажир', fio, passport) => {
    const {data} = await $host.post('api/user/reg', {login, password, userRole, fio, passport})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/check')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}