import React from 'react'
import {authAdminRoute, authOperatorRoute, authPassengerRoute, publicRoutes} from '../routes'
import {Routes, Route} from 'react-router-dom'
import Flights from '../pages/Flights'

const AppRouter = () => {
    return (
        <Routes>
            {
                publicRoutes.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                authAdminRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                authOperatorRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            {
                authPassengerRoute.map(({path, element}) => <Route key={path} path={path} element={element}/>)
            }
            <Route path="*" element={<Flights/>}/>
        </Routes>
    )
}

export default AppRouter
