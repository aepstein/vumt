import {
    GET_NOTICES,
    CLEAR_NOTICES
} from './types';

export const returnNotices = (msg, status, id = null) => {
    const validationErrors = msg.validationErrors ? msg.validationErrors : []
    return {
        type: GET_NOTICES,
        payload: { msg, status, id, validationErrors }
    };
};

export const clearNotices = () => {
    return {
        type: CLEAR_NOTICES
    };
};