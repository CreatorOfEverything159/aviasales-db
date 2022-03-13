import {REMOVE_USER, SET_USER} from '../constants'

export const setUser = user => ({
    type: SET_USER,
    payload: user
})

export const removeUser = user => ({
    type: REMOVE_USER,
    payload: user
})