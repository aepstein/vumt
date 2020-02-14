import axios from 'axios';
import prepareTokenConfig from '../lib/prepareTokenConfig'
import { 
    returnErrors
} from './errorActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
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

export const login = (attrs) => async (dispatch) => {
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

export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

export const loadUser = () => async (dispatch,getState) => {
    dispatch({type: USER_LOADING})
    try {
        const res = await axios.get('/api/auth/user', tokenConfig(getState))
        dispatch({
                type: USER_LOADED,
                payload: transformDates(res.data)
        })
    }
    catch(err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}
