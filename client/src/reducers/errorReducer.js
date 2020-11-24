import {
    GET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT_SUCCESS
} from '../actions/types';

const initialState = {
    msg: {},
    validationErrors: [],
    status: null,
    id: null
}

export default function errorReducer(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                validationErrors: action.payload.validationErrors,
                status: action.payload.status,
                id: action.payload.id
            };
        case CLEAR_ERRORS:
            return initialState;
        default:
            return state;
    }
}