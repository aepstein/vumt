import axios from 'axios';
import {
    GET_VISITS,
    ADD_VISIT,
    UPDATE_VISIT,
    SAVING_VISIT,
    SAVING_VISIT_CANCEL,
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
                payload: res.data.map((visit) => {
                    return {
                        ...visit,
                        startOn: Date.parse(visit.startOn),
                        checkedIn: visit.checkedIn ? Date.parse(visit.checkedIn) : ''
                    }
                })
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

export const saveVisit = (visit, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_VISIT })
    const res = visit._id ? await axios
            .put('/api/visits/' + visit._id, visit, tokenConfig(getState)) : 
        await axios
            .post('/api/visits', visit, tokenConfig(getState))
    try {
        dispatch({
            type: visit._id ? UPDATE_VISIT : ADD_VISIT,
            payload: {
                ...res.data,
                startOn: Date.parse(res.data.startOn),
                checkedIn: res.data.checkedIn ? Date.parse(res.data.checkedIn) : ''
            }
        })
        history.push('/')
    }
    catch(err) {
        dispatch({type: SAVING_VISIT_CANCEL})
        dispatch(returnErrors(err.response.data,err.response.status))
    }
}

export const setVisitsLoading = () => {
    return {
        type: VISITS_LOADING
    };
};