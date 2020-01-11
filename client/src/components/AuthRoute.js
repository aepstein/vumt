import React, { useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from './Spinner'

function AuthRoute({ children, ...rest }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const isLoading = useSelector(state => state.auth.isLoading)
    const token = useSelector(state => state.auth.token)

    const history = useHistory()

    useEffect(() => {
      if (!isAuthenticated && !isLoading && !token) {
        history.push('/need-auth')
      }
    },[isAuthenticated,isLoading,token,history])

    return ( 
      <Route
        {...rest}
        render={() => isAuthenticated ? children : <Spinner />}
      />
    );
  }

export default AuthRoute
