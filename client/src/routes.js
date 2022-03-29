import {
    ADMIN_ROUTE,
    FLIGHTS_ROUTE,
    LOGIN_ROUTE,
    OPERATOR_ROUTE,
    PASSENGER_ROUTE,
    REGISTRATION_ROUTE
} from './utils/consts'
import Flights from './pages/Flights'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Operator from './pages/Operator'
import Passenger from './pages/Passenger'

export const publicRoutes = [
    {
        path: FLIGHTS_ROUTE,
        element: <Flights/>
    },
    {
        path: LOGIN_ROUTE,
        element: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        element: <Auth/>
    },
]

export const authAdminRoute = [
    {
        path: ADMIN_ROUTE,
        element: <Admin/>
    }
]

export const authOperatorRoute = [
    {
        path: OPERATOR_ROUTE,
        element: <Operator/>
    }
]

export const authPassengerRoute = [
    {
        path: PASSENGER_ROUTE,
        element: <Passenger/>
    }
]