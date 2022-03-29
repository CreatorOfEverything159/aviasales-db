import {REMOVE_USER, SET_USER} from '../constants'

const initState = {
    auth: false,
    login: null,
    userRole: null,
    passengerPassport: null,
    fio: null,
    tickets: []
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                ...action.payload
            }
        case REMOVE_USER:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default userReducer
