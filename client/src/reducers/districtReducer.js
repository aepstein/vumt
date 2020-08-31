import { 
    GET_DISTRICTS,
    ADD_DISTRICT,
    UPDATE_DISTRICT,
    SAVING_DISTRICT,
    DELETE_DISTRICT,
    DISTRICTS_LOADING,
    LOGOUT_SUCCESS,
    SAVING_DISTRICT_CANCEL
} from '../actions/types';

const initialState = {
    districts: [],
    districtsLoading: false,
    districtsLoaded: false,
    districtSaving: false
}

const reduceUpdatedDistricts = (districts,payload) => {
    const i = districts.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedDistricts = [...districts]
    reducedDistricts[i] = payload
    return reducedDistricts
}

export default function( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_DISTRICTS:
            return {
                ...state,
                districts: action.payload,
                districtsLoading: false,
                districtsLoaded: true
            };
        case DELETE_DISTRICT:
            return {
                ...state,
                districts: state.districts.filter(district => district._id !== action.payload)
            };
        case ADD_DISTRICT:
            return {
                ...state,
                districts: [action.payload, ...state.districts],
                districtSaving: false
            }
        case UPDATE_DISTRICT:
            return {
                ...state,
                districts: reduceUpdatedDistricts(state.districts,action.payload),
                districtSaving: false
            }
        case SAVING_DISTRICT:
            return {
                ...state,
                districtSaving: true
            }
        case SAVING_DISTRICT_CANCEL:
            return {
                ...state,
                districtSaving: false
            }
        case DISTRICTS_LOADING:
            return {
                ...state,
                districtsLoading: true
            }
        default:
            return state;
    }
}