import {BrowserRouter} from 'react-router-dom'
import Navigation from './components/Navigation'
import AppRouter from './components/AppRouter'
import {useEffect, useState} from 'react'
import {check} from './http/userAPI'
import {setUser} from './store/actions/user'
import {useDispatch} from 'react-redux'
import {Spinner} from 'react-bootstrap'

function App() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check()
            .then(data => {
                dispatch(setUser({auth: true, ...data}))
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <Spinner animation={"grow"}/>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Navigation/>
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App
