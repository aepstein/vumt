import axios from 'axios';
import {
    FILTER_DISTRICTS,
    GET_DISTRICTS,
    ADD_DISTRICT,
    UPDATE_DISTRICT,
    SAVING_DISTRICT,
    SAVING_DISTRICT_CANCEL,
    DELETE_DISTRICT,
    DISTRICTS_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'

const parseDates = ({createdAt, endOn, startOn, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterDistricts = (q) => (dispatch, getState) => {
    if (q === getState().district.q) { return }
    dispatch({
        type: FILTER_DISTRICTS,
        payload: { q }
    })
    dispatch(getDistricts)
}

export const getDistricts = (dispatch, getState) => {
    dispatch(setDistrictsLoading())
    const q = getState().district.q
    const next = getState().district.next
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if ( q !== getState().district.q ) { return }
            const districts = res.data.data.map((district) => {
                return {
                    ...district,
                    ...parseDates(district)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_DISTRICTS,
                payload: { districts, next }
            })
        })
    .catch(err => {
        dispatch(returnErrors(err.response.data,err.response.status))
    });
};

export const deleteDistrict = id => (dispatch, getState) => {
    axios
        .delete(`/api/districts/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_DISTRICT,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data,err.response.status))
        })
};

export const saveDistrict = (district, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_DISTRICT })
    dispatch(clearErrors())
    try {
        const res = district._id ? await axios
            .put('/api/districts/' + district._id, district, tokenConfig(getState)) : 
            await axios
            .post('/api/districts', district, tokenConfig(getState))
        dispatch({
            type: district._id ? UPDATE_DISTRICT : ADD_DISTRICT,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/districts')
    }
    catch(err) {
        dispatch({type: SAVING_DISTRICT_CANCEL})
        dispatch(returnErrors(err.response.data,err.response.status))
    }
}

export const setDistrictsLoading = () => {
    return {
        type: DISTRICTS_LOADING
    }
}