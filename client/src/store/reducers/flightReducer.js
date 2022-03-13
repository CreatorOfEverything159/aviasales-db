import {ADD_ALL_FLIGHTS} from '../constants'

const initState = []
const flightReducer = (state = initState, action) => {
    switch (action.type) {
        case ADD_ALL_FLIGHTS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default flightReducer