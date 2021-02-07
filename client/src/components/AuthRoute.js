import React, { useEffect } from 'react'
import { useHistory, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from 'reactstrap'
import { returnNotices } from '../actions/noticeActions'

function AuthRoute({ roles, children, ...rest }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const isLoading = useSelector(state => state.auth.isLoading)
    const token = useSelector(state => state.auth.token)
    const user = useSelector(state => state.auth.user)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if (!isAuthenticated && !isLoading && !token) {
            history.push('/need-auth')
        }
    },[isAuthenticated,isLoading,token,history])

    if (isAuthenticated && roles && roles.filter(r => user.roles.includes(r)).length === 0) {
        dispatch(returnNotices('Insufficient permissions'))
        history.push('/')
    }

    return ( 
      <Route
        {...rest}
        render={() => isAuthenticated ? children : <Spinner color="primary" />}
      />
    );
  }

export default AuthRoute
