import { GET_VISITS, ADD_VISIT, DELETE_VISIT } from './types'

export const getVisits = () => {
    return {
        type: GET_VISITS
    };
};