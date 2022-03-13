import {combineReducers} from 'redux'
import flightReducer from './flightReducer'
import userReducer from './userReducer'

export default combineReducers({
    flightReducer,
    userReducer
})