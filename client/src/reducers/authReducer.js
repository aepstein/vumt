 
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SAVING_AUTHUSER,
    UPDATE_AUTHUSER_SUCCESS,
    UPDATE_AUTHUSER_FAIL
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    saving: false,
    user: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case SAVING_AUTHUSER:
            return {
                ...state,
                saving: true
            }
        case UPDATE_AUTHUSER_SUCCESS:
            return {
                ...state,
                saving: false,
                user: action.payload
            }
        case UPDATE_AUTHUSER_FAIL:
            return {
                ...state,
                saving: false
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                saving: false
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isLoading: false,
                isAuthenticated: false,
                saving: false
            };
        default:
            return state;
    }
}