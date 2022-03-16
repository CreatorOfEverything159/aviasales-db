import {$authHost, $host} from './index'
import jwtDecode from 'jwt-decode'

export const authorization = async (
    login,
    password
) => {
    const {data} = await $host.post(
        'api/user/login',
        {
            login,
            password
        })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const registration = async (
    login,
    password,
    userRole = 'Пассажир',
    fio = null,
    passport = null
) => {
    const {data} = await $host.post(
        'api/user/reg',
        {
            login,
            password,
            userRole,
            fio,
            passport
        })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const userRegistration = async (
    login,
    password,
    userRole
) => {
    const {data} = await $host.post(
        'api/user/reg-user',
        {
            login,
            password,
            userRole
        })
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/check')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUsers = async (
    role
) => {
    const {data} = await $authHost.post(
        'api/user/users', {
            role
        })
    return data
}

export const getUser = async (
    login
) => {
    const {data} = await $authHost.post(
        'api/user/user', {
            login
        })
    return data
}

export const searchUser = async (
    login,
    role
) => {
    const {data} = await $authHost.post(
        'api/user/search', {
            login,
            role
        })
    return data
}

export const removeUser = async (
    login,
    role
) => {
    const {data} = await $authHost.post(
        'api/user/remove',{
            login,
            role
        })
    return data
}
