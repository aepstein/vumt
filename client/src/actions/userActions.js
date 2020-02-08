import axios from 'axios';
import {
    GET_USERS,
    ADD_USER,
    UPDATE_USER,
    SAVING_USER,
    SAVING_USER_CANCEL,
    DELETE_USER,
    USERS_LOADING
 } from './types';
 import { tokenConfig } from './authActions'
 import { returnErrors } from './errorActions'

export const getUsers = () => (dispatch, getState) => {
    dispatch(setUsersLoading())
    axios
        .get('/api/users',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_USERS,
                payload: res.data.map((user) => {
                    return {
                        ...user
                    }
                })
            })
        })
    .catch(err => {
        dispatch(returnErrors(err.response.data,err.response.status))
    });
};

export const deleteUser = id => (dispatch, getState) => {
    axios
        .delete(`/api/users/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_USER,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data,err.response.status))
        })
};

export const saveUser = (user, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_USER })
    const res = user._id ? await axios
            .put('/api/users/' + user._id, user, tokenConfig(getState)) : 
        await axios
            .post('/api/users', user, tokenConfig(getState))
    try {
        dispatch({
            type: user._id ? UPDATE_USER : ADD_USER,
            payload: {
                ...res.data
            }
        })
        history.push('/users')
    }
    catch(err) {
        dispatch({type: SAVING_USER_CANCEL})
        dispatch(returnErrors(err.response.data,err.response.status))
    }
}

export const setUsersLoading = () => {
    return {
        type: USERS_LOADING
    }
}