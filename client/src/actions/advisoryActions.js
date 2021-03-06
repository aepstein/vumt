import axios from 'axios';
import {
    FILTER_ADVISORIES,
    GET_ADVISORIES,
    ADD_ADVISORY,
    UPDATE_ADVISORY,
    SAVING_ADVISORY,
    SAVING_ADVISORY_CANCEL,
    DELETE_ADVISORY,
    ADVISORIES_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnNotices, clearNotices } from './noticeActions'

const parseDates = ({createdAt, endOn, startOn, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        endOn: Date.parse(endOn),
        startOn: Date.parse(startOn),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterAdvisories = (q) => (dispatch, getState) => {
    if (q === getState().advisory.q) { return }
    dispatch({
        type: FILTER_ADVISORIES,
        payload: { q }
    })
    dispatch(getAdvisories)
}

export const getAdvisories = (dispatch, getState) => {
    dispatch(setAdvisoriesLoading())
    const {q,next} = getState().advisory
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if ( q !== getState().advisory.q ) { return }
            const advisories = res.data.data.map((advisory) => {
                return {
                    ...advisory,
                    ...parseDates(advisory)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_ADVISORIES,
                payload: { advisories, next }
            })
        })
    .catch(err => {
        dispatch(returnNotices(err.response.data,err.response.status))
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
            dispatch(returnNotices(err.response.data,err.response.status))
        })
};

export const saveAdvisory = (advisory, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_ADVISORY })
    dispatch(clearNotices())
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
        dispatch(returnNotices(err.response.data,err.response.status))
    }
}

export const setAdvisoriesLoading = () => {
    return {
        type: ADVISORIES_LOADING
    }
}