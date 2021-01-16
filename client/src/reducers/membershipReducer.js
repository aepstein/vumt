import {
    FILTER_MEMBERSHIPS,
    GET_MEMBERSHIPS,
    INIT_MEMBERSHIPS,
    ADD_MEMBERSHIP,
    UPDATE_MEMBERSHIP,
    SAVING_MEMBERSHIP,
    DELETE_MEMBERSHIP,
    MEMBERSHIPS_LOADING,
    LOGOUT_SUCCESS,
    SAVING_MEMBERSHIP_CANCEL
} from '../actions/types';

const initialState = {
    initNext: null,
    organization: null,
    next: null,
    q: '',
    membership: null,
    memberships: [],
    membershipsLoading: false,
    membershipsLoaded: false,
    membershipSaving: false
}

const reduceUpdatedMemberships = (memberships,payload) => {
    const i = memberships.reduce((pre,cur,i) => {
        if (cur.user._id === payload.user._id) return i
        return pre
    },-1)
    const reducedMemberships = [...memberships]
    reducedMemberships[i] = payload
    return reducedMemberships
}

export default function membershipReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case FILTER_MEMBERSHIPS:
            return {
                ...state,
                q: action.payload.q,
                next: `${state.initNext}?q=${action.payload.q}`,
                memberships: [],
                membershipsLoading: true,
                membershipsLoaded: false
            }
        case GET_MEMBERSHIPS:
            return {
                ...state,
                next: action.payload.next,
                memberships: state.memberships.concat(action.payload.memberships),
                membershipsLoading: false,
                membershipsLoaded: true
            };
        case INIT_MEMBERSHIPS:
            return {
                ...initialState,
                initNext: action.payload.initNext,
                next: action.payload.initNext,
                organization: action.payload.organization
            }
        case DELETE_MEMBERSHIP:
            return {
                ...state,
                memberships: state.memberships.filter(membership => membership.user._id !== action.payload)
            };
        case ADD_MEMBERSHIP:
            return {
                ...state,
                memberships: [action.payload, ...state.memberships],
                membershipSaving: false
            }
        case UPDATE_MEMBERSHIP:
            return {
                ...state,
                memberships: reduceUpdatedMemberships(state.memberships,action.payload),
                membershipSaving: false
            }
        case SAVING_MEMBERSHIP:
            return {
                ...state,
                membershipSaving: true
            }
        case SAVING_MEMBERSHIP_CANCEL:
            return {
                ...state,
                membershipSaving: false
            }
        case MEMBERSHIPS_LOADING:
            return {
                ...state,
                membershipsLoading: true
            }
        default:
            return state;
    }
}