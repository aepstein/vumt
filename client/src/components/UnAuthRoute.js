import React, { useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

function UnAuthRoute({ children, ...rest }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const isLoading = useSelector(state => state.auth.isLoading)

    const history = useHistory()

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            history.push('/')
        }
    },[isAuthenticated,isLoading,history])

    return (
        <Route
            {...rest}
            render={() => isAuthenticated ? <Spinner/> : children}
        />
    );
}
export default UnAuthRoute
