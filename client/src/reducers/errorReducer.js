import {
    GET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT_SUCCESS
} from '../actions/types';

const initialState = {
    msg: {},
    status: null,
    id: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            };
        case CLEAR_ERRORS:
            return initialState;
        default:
            return state;
    }
}