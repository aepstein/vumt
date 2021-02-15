import axios from 'axios';
import {
    FILTER_THEMES,
    GET_THEMES,
    ADD_THEME,
    UPDATE_THEME,
    SAVING_THEME,
    SAVING_THEME_CANCEL,
    DELETE_THEME,
    THEMES_LOADING
 } from './types';
import { tokenConfig } from './authActions'
import { returnNotices, clearNotices } from './noticeActions'

const parseDates = ({createdAt, updatedAt}) => {
    return {
        createdAt: Date.parse(createdAt),
        updatedAt: Date.parse(updatedAt)
    }
}

export const filterThemes = (q) => (dispatch, getState) => {
    if (q === getState().theme.q) { return }
    dispatch({
        type: FILTER_THEMES,
        payload: { q }
    })
    dispatch(getThemes)
}

export const getThemes = (dispatch, getState) => {
    dispatch(setThemesLoading())
    const q = getState().theme.q
    const next = getState().theme.next
    const config = tokenConfig(getState)
    axios
        .get(next,config)
        .then(res => {
            if ( q !== getState().theme.q ) { return }
            const themes = res.data.data.map((theme) => {
                return {
                    ...theme,
                    ...parseDates(theme)
                }
            })
            const next = res.data.links.next
            dispatch({
                type: GET_THEMES,
                payload: { themes, next }
            })
        })
    .catch(err => {
        dispatch(returnNotices(err.response.data,err.response.status))
    });
};

export const deleteTheme = id => (dispatch, getState) => {
    axios
        .delete(`/api/themes/${id}`,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_THEME,
                payload: id
            });
        })
        .catch(err => {
            dispatch(returnNotices(err.response.data,err.response.status))
        })
};

export const saveTheme = (theme, history) => async (dispatch, getState) => {
    dispatch({ type: SAVING_THEME })
    dispatch(clearNotices())
    try {
        const res = theme._id ? await axios
            .put('/api/themes/' + theme._id, theme, tokenConfig(getState)) : 
            await axios
            .post('/api/themes', theme, tokenConfig(getState))
        dispatch({
            type: theme._id ? UPDATE_THEME : ADD_THEME,
            payload: {
                ...res.data,
                ...parseDates(res.data)
            }
        })
        history.push('/themes')
    }
    catch(err) {
        dispatch({type: SAVING_THEME_CANCEL})
        dispatch(returnNotices(err.response.data,err.response.status))
    }
}

export const setThemesLoading = () => {
    return {
        type: THEMES_LOADING
    }
}