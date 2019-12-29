import { 
    GET_VISITS,
    ADD_VISIT,
    ADDING_VISIT,
    DELETE_VISIT,
    VISITS_LOADING,
    LOGOUT_SUCCESS
} from '../actions/types';

const initialState = {
    visits: [],
    visitsLoading: false,
    visitsLoaded: false,
    visitSaving: false
}

export default function( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_VISITS:
            return {
                ...state,
                visits: action.payload,
                visitsLoading: false,
                visitsLoaded: true
            };
        case DELETE_VISIT:
            return {
                ...state,
                visits: state.visits.filter(visit => visit._id !== action.payload)
            };
        case ADD_VISIT:
            return {
                ...state,
                visits: [action.payload, ...state.visits],
                visitSaving: false
            }
        case ADDING_VISIT:
            return {
                ...state,
                visitSaving: true
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