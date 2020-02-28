import {
    GEO_CLEAR,
    GEO_LOADED,
    GEO_UNWATCH,
    GEO_WATCH
} from '../actions/types'

const initialState = {
    loaded: false,
    position: null,
    watch: null
}

export default function (state = initialState, action) {
    switch(action.type) {
        case GEO_CLEAR:
            return {
                ...state,
                ...initialState
            }
        case GEO_LOADED:
            return {
                ...state,
                loaded: true,
                position: action.payload
            }
        case GEO_UNWATCH:
            return {
                ...state,
                watch: null
            }
        case GEO_WATCH:
            return {
                ...state,
                watch: action.payload
            }
        default:
            return state
    }
}