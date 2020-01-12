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
    REGISTER_FAIL
} from './types';

export const tokenConfig = getState => {
    return prepareTokenConfig(getState().auth.token)
}

export const register = ({firstName, lastName, email, password, country}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        country
    });
    axios.post('/api/users', body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data,err.response.status,'REGISTER_FAIL')
            );
            dispatch({
                type: REGISTER_FAIL
            })
        })
}

export const login = ({email, password}) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({
        email,
        password
    });
    axios.post('/api/auth', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data,err.response.status,'LOGIN_FAIL')
            );
            dispatch({
                type: LOGIN_FAIL
            })
        })
}

export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
};

export const loadUser = () => (dispatch,getState) => {
    dispatch({type: USER_LOADING});
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch( returnErrors(err.response.data, err.response.status) );
            dispatch({
                type: AUTH_ERROR
            });
        });
};
