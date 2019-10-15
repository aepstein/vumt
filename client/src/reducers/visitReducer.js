// TODO remove UUID after connection to backend is complete
import uuid from 'uuid';
import { GET_VISITS, ADD_VISIT, DELETE_VISIT } from '../actions/types'

const initialState = {
    visits: [
        { id: uuid(), name: 'Algonquin' },
        { id: uuid(), name: 'Pitchoff' },
        { id: uuid(), name: 'Hadley' },
        { id: uuid(), name: 'Owl\'s Head' },
    ]
}

export default function( state = initialState, action ) {
    switch(action.type) {
        case GET_VISITS:
            return {
                ...state
            };
        case DELETE_VISIT:
            return {
                ...state,
                visits: state.visits.filter(visit => visit.id !== action.payload)
            };
        case ADD_VISIT:
            return {
                ...state,
                visits: [action.payload, ...state.visits]
            }
        default:
            return state;
    }
}