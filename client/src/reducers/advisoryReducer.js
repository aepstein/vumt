import { 
    GET_ADVISORIES,
    ADD_ADVISORY,
    UPDATE_ADVISORY,
    SAVING_ADVISORY,
    DELETE_ADVISORY,
    ADVISORIES_LOADING,
    LOGOUT_SUCCESS,
    SAVING_ADVISORY_CANCEL
} from '../actions/types';

const initialState = {
    advisories: [],
    advisoriesLoading: false,
    advisoriesLoaded: false,
    advisorySaving: false
}

const reduceUpdatedAdvisories = (advisories,payload) => {
    const i = advisories.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedAdvisories = [...advisories]
    reducedAdvisories[i] = payload
    return reducedAdvisories
}

export default function advisoryReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_ADVISORIES:
            return {
                ...state,
                advisories: action.payload,
                advisoriesLoading: false,
                advisoriesLoaded: true
            };
        case DELETE_ADVISORY:
            return {
                ...state,
                advisories: state.advisories.filter(advisory => advisory._id !== action.payload)
            };
        case ADD_ADVISORY:
            return {
                ...state,
                advisories: [action.payload, ...state.advisories],
                advisorySaving: false
            }
        case UPDATE_ADVISORY:
            return {
                ...state,
                advisories: reduceUpdatedAdvisories(state.advisories,action.payload),
                advisorySaving: false
            }
        case SAVING_ADVISORY:
            return {
                ...state,
                advisorySaving: true
            }
        case SAVING_ADVISORY_CANCEL:
            return {
                ...state,
                advisorySaving: false
            }
        case ADVISORIES_LOADING:
            return {
                ...state,
                advisoriesLoading: true
            }
        default:
            return state;
    }
}