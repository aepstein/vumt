import axios from 'axios';
import {
    GET_ADVISORIES,
    ADD_ADVISORY,
    UPDATE_ADVISORY,
    SAVING_ADVISORY,
    SAVING_ADVISORY_CANCEL,
    DELETE_ADVISORY,
    ADVISORIES_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'

const parseDates = ({createdAt, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const getAdvisories = () => (dispatch, getState) => {
    dispatch(setAdvisoriesLoading())
    axios
        .get('/api/advisories',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ADVISORIES,
                payload: res.data.map((advisory) => {
                    return {
                        ...advisory,
                        ...parseDates(advisory)
                    }
                })
            })
        })
    .catch(err => {
        dispatch(returnErrors(err.response.data,err.response.status))
    });
};

export const deleteAdvisory = id => (dispatch, getState) => {
    axios
        .delete(`/api/advisories/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_ADVISORY,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data,err.response.status))
        })
};

export const saveAdvisory = (advisory, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_ADVISORY })
    dispatch(clearErrors())
    try {
        const res = advisory._id ? await axios
            .put('/api/advisories/' + advisory._id, advisory, tokenConfig(getState)) : 
            await axios
            .post('/api/advisories', advisory, tokenConfig(getState))
        dispatch({
            type: advisory._id ? UPDATE_ADVISORY : ADD_ADVISORY,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/advisories')
    }
    catch(err) {
        dispatch({type: SAVING_ADVISORY_CANCEL})
        dispatch(returnErrors(err.response.data,err.response.status))
    }
}

export const setAdvisoriesLoading = () => {
    return {
        type: ADVISORIES_LOADING
    }
}