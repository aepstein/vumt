import { 
    GET_VISITS,
    ADD_VISIT,
    UPDATE_VISIT,
    SAVING_VISIT,
    DELETE_VISIT,
    VISITS_LOADING,
    LOGOUT_SUCCESS,
    SAVING_VISIT_CANCEL
} from '../actions/types';

const initialState = {
    visits: [],
    visitsLoading: false,
    visitsLoaded: false,
    visitSaving: false
}

const reduceUpdatedVisits = (visits,payload) => {
    const i = visits.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedVisits = [...visits]
    reducedVisits[i] = payload
    return reducedVisits
}

export default function visitReducer( state = initialState, action ) {
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
        case UPDATE_VISIT:
            return {
                ...state,
                visits: reduceUpdatedVisits(state.visits,action.payload),
                visitSaving: false
            }
        case SAVING_VISIT:
            return {
                ...state,
                visitSaving: true
            }
        case SAVING_VISIT_CANCEL:
            return {
                ...state,
                visitSaving: false
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