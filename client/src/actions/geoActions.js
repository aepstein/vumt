import {
    GEO_CLEAR,
    GEO_LOADED,
    GEO_UNWATCH,
    GEO_WATCH
} from './types'

const setLocation = (position) => (dispatch) => {
    dispatch({
        type: GEO_LOADED,
        payload: position
    })
}

const clearLocation = (dispatch) => {
    dispatch({
        type: GEO_CLEAR
    })
}

export const initLocation = (dispatch, getState) => {
    const user = getState().auth.user
    const watch = getState().geo.watch
    if (user && user.enableGeolocation) {
        if (!watch) dispatch(watchLocation)
    }
    else {
        if (watch) dispatch(unwatchLocation)
    }
}

export const watchLocation = (dispatch,getState) => {
    if (!navigator.geolocation || getState().geo.watch) return
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            dispatch(setLocation(position))
        },
        () => {
            dispatch(clearLocation)
        }
    )
    dispatch({
        type: GEO_WATCH,
        payload: watchId
    })
}

export const unwatchLocation = (dispatch,getState) => {
    const watch = getState().geo.watch
    if (!navigator.geolocation || !watch) return
    navigator.geolocation.clearWatch(watch)
    dispatch({type: GEO_UNWATCH})
    dispatch(clearLocation)
}