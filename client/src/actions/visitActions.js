import { GET_VISITS, ADD_VISIT, DELETE_VISIT } from './types'

export const getVisits = () => {
    return {
        type: GET_VISITS
    };
};

export const deleteVisit = (id) => {
    return {
        type: DELETE_VISIT,
        payload: id
    };
};

export const addVisit = (newVisit) => {
    return {
        type: ADD_VISIT,
        payload: newVisit
    };
};
