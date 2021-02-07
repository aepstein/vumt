import axios from 'axios';
import {
    FILTER_PLACES,
    GET_PLACES,
    ADD_PLACE,
    UPDATE_PLACE,
    SAVING_PLACE,
    SAVING_PLACE_CANCEL,
    DELETE_PLACE,
    PLACES_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnNotices, clearNotices } from './noticeActions'

const parseDates = ({createdAt, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterPlaces = (q) => (dispatch, getState) => {
    if (q === getState().place.q) { return }
    dispatch({
        type: FILTER_PLACES,
        payload: { q }
    })
    dispatch(getPlaces)
}

export const getPlaces = (dispatch, getState) => {
    dispatch(setPlacesLoading())
    const { q, next } = getState().place
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if (q !== getState().place.q) { return }
            const places = res.data.data.map((place) => {
                return {
                    ...place,
                    ...parseDates(place)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_PLACES,
                payload: { places, next }
            })
        })
    .catch(err => {
        console.log('error')
        dispatch(returnNotices(err.response.data,err.response.status))
    });
};

export const deletePlace = id => (dispatch, getState) => {
    axios
        .delete(`/api/places/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_PLACE,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnNotices(err.response.data,err.response.status))
        })
};

export const savePlace = (place, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_PLACE })
    dispatch(clearNotices())
    try {
        const res = place._id ? await axios
            .put('/api/places/' + place._id, place, tokenConfig(getState)) : 
            await axios
            .post('/api/places', place, tokenConfig(getState))
        dispatch({
            type: place._id ? UPDATE_PLACE : ADD_PLACE,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/places')
    }
    catch(err) {
        dispatch({type: SAVING_PLACE_CANCEL})
        dispatch(returnNotices(err.response.data,err.response.status))
    }
}

export const setPlacesLoading = () => {
    return {
        type: PLACES_LOADING
    }
}