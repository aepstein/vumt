import axios from 'axios';
import {
    FILTER_USERS,
    GET_USERS,
    ADD_USER,
    UPDATE_USER,
    SAVING_USER,
    SAVING_USER_CANCEL,
    DELETE_USER,
    USERS_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnNotices, clearNotices } from './noticeActions'

const parseDates = ({createdAt,updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterUsers = (q) => (dispatch, getState) => {
    if (q === getState().user.q) { return }
    dispatch({
        type: FILTER_USERS,
        payload: { q }
    })
    dispatch(getUsers)
}

export const getUsers = (dispatch, getState) => {
    dispatch(setUsersLoading)
    const q = getState().user.q
    const next = getState().user.next
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then((res) => {
            // Skip posting this list of users if query has changed since initiation
            if ( q !== getState().user.q ) { return }
            const users = res.data.data.map((user) => {
                return {
                    ...user,
                    ...parseDates(user)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_USERS,
                payload: { users, next }
            })
        })
        .catch((err) => {
            dispatch(returnNotices(err.response.data,err.response.status))
        })
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
            dispatch(returnNotices(err.response.data,err.response.status))
        })
};

export const saveUser = (user, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_USER })
    dispatch(clearNotices())
    try {
        const res = user._id ? await axios
        .put('/api/users/' + user._id, user, tokenConfig(getState)) : 
        await axios
        .post('/api/users', user, tokenConfig(getState))
        dispatch({
            type: user._id ? UPDATE_USER : ADD_USER,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/users')
    }
    catch(err) {
        dispatch({type: SAVING_USER_CANCEL})
        dispatch(returnNotices(err.response.data,err.response.status))
    }
}

export const setUsersLoading = {
    type: USERS_LOADING
}