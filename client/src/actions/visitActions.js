import axios from 'axios';
import {
    GET_VISITS,
    ADD_VISIT,
    DELETE_VISIT,
    VISITS_LOADING
 } from './types';

export const getVisits = () => dispatch => {
    dispatch(setVisitsLoading());
    axios
        .get('/api/visits')
        .then(res => {
            dispatch({
                type: GET_VISITS,
                payload: res.data
            });
        });
};

export const deleteVisit = (id) => dispatch => {
    axios
        .delete(`/api/visits/${id}`)
        .then(res => {
            dispatch({
                type: DELETE_VISIT,
                payload: id
            });
        });
};

export const addVisit = (newVisit) => dispatch => {
    axios
        .post('/api/visits', newVisit)
        .then(res => {
            dispatch({
                type: ADD_VISIT,
                payload: res.data
            });
        });
};

export const setVisitsLoading = () => {
    return {
        type: VISITS_LOADING
    };
};