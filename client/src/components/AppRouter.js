import React from 'react'
import {authAdminRoute, authOperatorRoute, authPassengerRoute, publicRoutes} from '../routes'
import {Routes, Route} from 'react-router-dom'
import Flights from '../pages/Flights'
import {useSelector} from 'react-redux'

const AppRouter = () => {
    const stateUser = useSelector(state => state.userReducer)

    return (
        <Routes>
            {
                publicRoutes.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                stateUser.auth
                && stateUser.userRole === 'Администратор'
                && authAdminRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                stateUser.auth
                && stateUser.userRole === 'Оператор'
                && authOperatorRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                stateUser.auth
                && stateUser.userRole === 'Пассажир'
                && authPassengerRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            <Route path="*" element={<Flights/>}/>
        </Routes>
    )
}

export default AppRouter
