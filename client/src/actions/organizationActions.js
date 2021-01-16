import axios from 'axios';
import {
    FILTER_ORGANIZATIONS,
    GET_ORGANIZATIONS,
    ADD_ORGANIZATION,
    UPDATE_ORGANIZATION,
    SAVING_ORGANIZATION,
    SAVING_ORGANIZATION_CANCEL,
    DELETE_ORGANIZATION,
    ORGANIZATIONS_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'

const parseDates = ({createdAt, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterOrganizations = (q) => (dispatch, getState) => {
    if (q === getState().organization.q) { return }
    dispatch({
        type: FILTER_ORGANIZATIONS,
        payload: { q }
    })
    dispatch(getOrganizations)
}

export const getOrganizations = (dispatch, getState) => {
    dispatch(setOrganizationsLoading())
    const q = getState().organization.q
    const next = getState().organization.next
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if ( q !== getState().organization.q ) { return }
            const organizations = res.data.data.map((organization) => {
                return {
                    ...organization,
                    ...parseDates(organization)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_ORGANIZATIONS,
                payload: { organizations, next }
            })
        })
    .catch(err => {
        dispatch(returnErrors(err.response.data,err.response.status))
    });
};

export const deleteOrganization = id => (dispatch, getState) => {
    axios
        .delete(`/api/organizations/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_ORGANIZATION,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data,err.response.status))
        })
};

export const saveOrganization = (organization, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_ORGANIZATION })
    dispatch(clearErrors())
    try {
        const res = organization._id ? await axios
            .put('/api/organizations/' + organization._id, organization, tokenConfig(getState)) : 
            await axios
            .post('/api/organizations', organization, tokenConfig(getState))
        dispatch({
            type: organization._id ? UPDATE_ORGANIZATION : ADD_ORGANIZATION,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/organizations')
    }
    catch(err) {
        dispatch({type: SAVING_ORGANIZATION_CANCEL})
        dispatch(returnErrors(err.response.data,err.response.status))
    }
}

export const setOrganizationsLoading = () => {
    return {
        type: ORGANIZATIONS_LOADING
    }
}