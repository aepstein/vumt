import {
    FILTER_THEMES,
    GET_THEMES,
    ADD_THEME,
    UPDATE_THEME,
    SAVING_THEME,
    DELETE_THEME,
    THEMES_LOADING,
    LOGOUT_SUCCESS,
    SAVING_THEME_CANCEL
} from '../actions/types';

const initialState = {
    themes: [],
    themesLoading: false,
    themesLoaded: false,
    themeSaving: false,
    next: '/api/themes',
    q: ''
}

const reduceUpdatedThemes = (themes,payload) => {
    const i = themes.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedThemes = [...themes]
    reducedThemes[i] = payload
    return reducedThemes
}

export default function themeReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case FILTER_THEMES:
            return {
                ...state,
                q: action.payload.q,
                next: `${initialState.next}?q=${action.payload.q}`,
                themes: [],
                themesLoading: true,
                themesLoaded: false
            }
        case GET_THEMES:
            return {
                ...state,
                themes: state.themes.concat(action.payload.themes),
                themesLoading: false,
                themesLoaded: true,
                next: action.payload.next
            };
        case DELETE_THEME:
            return {
                ...state,
                themes: state.themes.filter(theme => theme._id !== action.payload)
            };
        case ADD_THEME:
            return {
                ...state,
                themes: [action.payload, ...state.themes],
                themeSaving: false
            }
        case UPDATE_THEME:
            return {
                ...state,
                themes: reduceUpdatedThemes(state.themes,action.payload),
                themeSaving: false
            }
        case SAVING_THEME:
            return {
                ...state,
                themeSaving: true
            }
        case SAVING_THEME_CANCEL:
            return {
                ...state,
                themeSaving: false
            }
        case THEMES_LOADING:
            return {
                ...state,
                themesLoading: true
            }
        default:
            return state;
    }
}