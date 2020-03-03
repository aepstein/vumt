import {
    GET_ERRORS,
    CLEAR_ERRORS
} from './types';

export const returnErrors = (msg, status, id = null) => {
    const validationErrors = msg.validationErrors ? msg.validationErrors : []
    return {
        type: GET_ERRORS,
        payload: { msg, status, id, validationErrors }
    };
};

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};