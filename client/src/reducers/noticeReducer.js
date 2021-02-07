import {
    GET_NOTICES,
    CLEAR_NOTICES,
    LOGOUT_SUCCESS
} from '../actions/types';

const initialState = {
    msg: {},
    validationErrors: [],
    status: null,
    id: null
}

export default function noticeReducer(state = initialState, action) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_NOTICES:
            return {
                msg: action.payload.msg,
                validationErrors: action.payload.validationErrors,
                status: action.payload.status,
                id: action.payload.id
            };
        case CLEAR_NOTICES:
            return initialState;
        default:
            return state;
    }
}