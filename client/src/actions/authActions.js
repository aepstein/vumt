import axios from 'axios';
import prepareTokenConfig from '../lib/prepareTokenConfig'
import { 
    returnErrors
} from './errorActions';
import {
    initLocation
} from './geoActions'

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGIN_CANCEL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST_FAIL,
    RESET_PASSWORD_REQUEST_SUCCESS,
    RESET_PASSWORD_REQUEST_CONTINUE,
    RESET_PASSWORD,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_CONTINUE,
    SAVING_AUTHUSER,
    UPDATE_AUTHUSER_SUCCESS,
    UPDATE_AUTHUSER_FAIL
} from './types';

const parseDates = ({createdAt,updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}
const transformDates = (data) => {
    if (data.user) {
        return {
            ...data,
            user: {
                ...data.user,
                ...parseDates(data.user)
            }
        }
    }
    return {
        ...data,
        ...parseDates(data)
    }
}

export const tokenConfig = getState => {
    return prepareTokenConfig(getState().auth.token)
}

export const register = (attrs,history) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(attrs)
    try {
        dispatch({type: SAVING_AUTHUSER})
        const res = await axios.post('/api/users', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: transformDates(res.data)
        })
        dispatch(initLocation)
        history.push('/')
    }
    catch(err) {
        dispatch(
            returnErrors(err.response.data,err.response.status,'REGISTER_FAIL')
        )
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

export const update = (user,attrs,history) => async (dispatch,getState) => {
    const body = JSON.stringify(attrs)
    try {
        dispatch({type: SAVING_AUTHUSER})
        const res = await axios.put('/api/users/' + user._id, body, tokenConfig(getState))
        dispatch({
            type: UPDATE_AUTHUSER_SUCCESS,
            payload: transformDates(res.data)
        })
        history.push('/profile')
    }
    catch(err) {
        dispatch(
            returnErrors(err.response.data,err.response.status,'UPDATE_AUTHUSER_FAIL')
        )
        dispatch({
            type: UPDATE_AUTHUSER_FAIL
        })
    }
}

export const login = (attrs,history) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const body = JSON.stringify(attrs)
        const res = await axios.post('/api/auth', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: transformDates(res.data)
        })
        dispatch(initLocation)
        history.push('/')
    }
    catch(err) {
        dispatch(
            returnErrors(err.response.data,err.response.status,'LOGIN_FAIL')
        )
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

export const requestResetPassword = (email) => async (dispatch) => {
    dispatch({type: RESET_PASSWORD_REQUEST})
    try {
        const res = await axios.post('/api/auth/resetPassword/' + encodeURIComponent(email))
        dispatch({type: RESET_PASSWORD_REQUEST_SUCCESS, payload: {email}})
    }
    catch(err) {
        dispatch(returnErrors(err.response.data,err.response.status,RESET_PASSWORD_REQUEST_FAIL))
        dispatch({type: RESET_PASSWORD_REQUEST_FAIL})
    }
}

export const requestResetPasswordContinue = (history) => async (dispatch) => {
    dispatch({type: RESET_PASSWORD_REQUEST_CONTINUE})
    history.push('/')
}

export const resetPasswordContinue = (dispatch) => {
    dispatch({type: RESET_PASSWORD_CONTINUE})
}

export const resetPassword = ({email,token,password}) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({password})
    dispatch({type: RESET_PASSWORD})
    try {
        const res = await axios
            .put(`/api/auth/resetPassword/${email}/${token}`,body,config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: transformDates(res.data)
        })
        dispatch(initLocation)
        dispatch({type: RESET_PASSWORD_SUCCESS})
    }
    catch(err) {
        dispatch(returnErrors(err.response.data,err.response.status,RESET_PASSWORD_FAIL))
        dispatch({type: RESET_PASSWORD_FAIL})
    } 
}

export const cancelLogin = (history) => (dispatch) => {
    dispatch({ type: LOGIN_CANCEL })
    history.push('/')
}

export const logout = (dispatch) => {
    dispatch({
        type: LOGOUT_SUCCESS
    })
    dispatch(initLocation)
}

export const loadUser = () => async (dispatch,getState) => {
    dispatch({type: USER_LOADING})
    try {
        const res = await axios.get('/api/auth/user', tokenConfig(getState))
        dispatch({
                type: USER_LOADED,
                payload: transformDates(res.data)
        })
        dispatch(initLocation)
    }
    catch(err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}
