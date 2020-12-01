 
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGIN_CANCEL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SAVING_AUTHUSER,
    UPDATE_AUTHUSER_SUCCESS,
    UPDATE_AUTHUSER_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST_CONTINUE,
    RESET_PASSWORD_REQUEST_FAIL,
    RESET_PASSWORD_REQUEST_SUCCESS,
    RESET_PASSWORD,
    RESET_PASSWORD_CONTINUE,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    resetPasswordEmail: null,
    resetPasswordComplete: false,
    saving: false,
    user: null
};

export default function authReducer (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case LOGIN:
        case RESET_PASSWORD:
        case RESET_PASSWORD_REQUEST:
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
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                saving: false,
                resetPasswordComplete: true
            }
        case RESET_PASSWORD_CONTINUE:
            return {
                ...state,
                resetPasswordComplete: false
            }
        case RESET_PASSWORD_REQUEST_SUCCESS:
            return {
                ...state,
                resetPasswordEmail: action.payload.email,
                saving: false
            }
        case RESET_PASSWORD_REQUEST_CONTINUE:
            return {
                ...state,
                resetPasswordEmail: null
            }
        case AUTH_ERROR:
        case RESET_PASSWORD_FAIL:
        case RESET_PASSWORD_REQUEST_FAIL:
        case LOGIN_FAIL:
        case LOGIN_CANCEL:
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