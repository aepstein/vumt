import axios from 'axios'
import {
    FILTER_MEMBERSHIPS,
    GET_MEMBERSHIPS,
    INIT_MEMBERSHIPS,
    ADD_MEMBERSHIP,
    UPDATE_MEMBERSHIP,
    SAVING_MEMBERSHIP,
    SAVING_MEMBERSHIP_CANCEL,
    DELETE_MEMBERSHIP,
    MEMBERSHIPS_LOADING
 } from './types'
import { tokenConfig } from './authActions'
import { clearNotices, returnNotices } from './noticeActions'

const initNext = (organization) => {
    return '/api/organizations/' + organization._id + '/users'
}

export const filterMemberships = (q) => (dispatch, getState) => {
    if (q === getState().membership.q) { return }
    dispatch({
        type: FILTER_MEMBERSHIPS,
        payload: { q }
    })
    dispatch(getMemberships)
}

export const getMemberships = (dispatch, getState) => {
    dispatch(setMembershipsLoading())
    const {q,next} = getState().membership
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if ( q !== getState().membership.q ) { return }
            const memberships = res.data.data.map((membership) => {
                return {
                    ...membership
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_MEMBERSHIPS,
                payload: {next,memberships}
            })
        })
    .catch(err => {
        dispatch(returnNotices(err.response.data,err.response.status))
    })
}

export const initMemberships = (organizationId) => (dispatch, getState) => {
    const organization = getState().organization.organizations.find((o) => {
        return o._id === organizationId
    })
    dispatch({
        type: INIT_MEMBERSHIPS,
        payload: {
            initNext: initNext(organization),
            organization
        }
    })
    dispatch(getMemberships)
}

export const deleteMembership = userId => (dispatch, getState) => {
    axios
        .delete(`${getState().membership.initNext}/${userId}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_MEMBERSHIP,
                payload: userId
            })
        })
        .catch(err => {
            dispatch(returnNotices(err.response.data,err.response.status))
        })
}

export const saveMembership = (create, membership, afterSave) => async (dispatch, getState) => {
    dispatch({ type: SAVING_MEMBERSHIP })
    dispatch(clearNotices())
    try {
        const res = await axios[create ? 'post' : 'put']
            (`${getState().membership.initNext}/${membership.user}`, membership, tokenConfig(getState))
        dispatch({
            type: create ? ADD_MEMBERSHIP : UPDATE_MEMBERSHIP,
            payload: {
                ...res.data
            }
        })
        afterSave()
    }
    catch(err) {
        console.log(err)
        dispatch({type: SAVING_MEMBERSHIP_CANCEL})
        dispatch(returnNotices(err.response.data,err.response.status))
    }
}

export const setMembershipsLoading = () => {
    return {
        type: MEMBERSHIPS_LOADING
    }
}