import { 
    GET_PLACES,
    ADD_PLACE,
    UPDATE_PLACE,
    SAVING_PLACE,
    DELETE_PLACE,
    PLACES_LOADING,
    LOGOUT_SUCCESS,
    SAVING_PLACE_CANCEL
} from '../actions/types';

const initialState = {
    places: [],
    placesLoading: false,
    placesLoaded: false,
    placeSaving: false
}

const reduceUpdatedPlaces = (places,payload) => {
    const i = places.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedPlaces = [...places]
    reducedPlaces[i] = payload
    return reducedPlaces
}

export default function( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case GET_PLACES:
            return {
                ...state,
                places: action.payload,
                placesLoading: false,
                placesLoaded: true
            };
        case DELETE_PLACE:
            return {
                ...state,
                places: state.places.filter(place => place._id !== action.payload)
            };
        case ADD_PLACE:
            return {
                ...state,
                places: [action.payload, ...state.places],
                placeSaving: false
            }
        case UPDATE_PLACE:
            return {
                ...state,
                places: reduceUpdatedPlaces(state.places,action.payload),
                placeSaving: false
            }
        case SAVING_PLACE:
            return {
                ...state,
                placeSaving: true
            }
        case SAVING_PLACE_CANCEL:
            return {
                ...state,
                placeSaving: false
            }
        case PLACES_LOADING:
            return {
                ...state,
                placesLoading: true
            }
        default:
            return state;
    }
}