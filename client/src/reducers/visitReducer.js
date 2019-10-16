import { 
    GET_VISITS,
    ADD_VISIT,
    DELETE_VISIT,
    VISITS_LOADING
} from '../actions/types';

const initialState = {
    visits: [],
    loading: false
}

export default function( state = initialState, action ) {
    switch(action.type) {
        case GET_VISITS:
            return {
                ...state,
                visits: action.payload,
                visitsLoading: false
            };
        case DELETE_VISIT:
            return {
                ...state,
                visits: state.visits.filter(visit => visit._id !== action.payload)
            };
        case ADD_VISIT:
            return {
                ...state,
                visits: [action.payload, ...state.visits]
            }
        case VISITS_LOADING:
            return {
                ...state,
                visitsLoading: true
            }
        default:
            return state;
    }
}