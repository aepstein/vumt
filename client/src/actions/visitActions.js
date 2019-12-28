import axios from 'axios';
import {
    GET_VISITS,
    ADD_VISIT,
    ADDING_VISIT,
    ADDING_VISIT_CANCEL,
    DELETE_VISIT,
    VISITS_LOADING
 } from './types';
 import { tokenConfig } from './authActions';
 import { returnErrors } from './errorActions';

export const getVisits = () => (dispatch, getState) => {
    const userId = getState().auth.user._id
    dispatch(setVisitsLoading());
    axios
        .get('/api/users/' + userId + '/visits',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_VISITS,
                payload: res.data
            });
        })
    .catch(err => {
        dispatch(returnErrors(err.response.data,err.response.status));
    });
};

export const deleteVisit = id => (dispatch, getState) => {
    axios
        .delete(`/api/visits/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_VISIT,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data,err.response.status));
        });
};

export const addVisit = newVisit => (dispatch, getState) => {
    dispatch({ type: ADDING_VISIT })
    axios
        .post('/api/visits', newVisit, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_VISIT,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({type: ADDING_VISIT_CANCEL})
            dispatch(returnErrors(err.response.data,err.response.status));
        });
};

export const setVisitsLoading = () => {
    return {
        type: VISITS_LOADING
    };
};