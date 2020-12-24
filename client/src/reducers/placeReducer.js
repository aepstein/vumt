import {
    FILTER_PLACES,
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
    next: '/api/places',
    places: [],
    placesLoading: false,
    placesLoaded: false,
    placeSaving: false,
    q: ''
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

export default function placeReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case FILTER_PLACES:
            return {
                ...state,
                q: action.payload.q,
                next: `${initialState.next}?q=${action.payload.q}`,
                places: [],
                placesLoading: true,
                placesLoaded: false
            }
        case GET_PLACES:
            return {
                ...state,
                next: action.payload.next,
                places: state.places.concat(action.payload.places),
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