import {
    FILTER_ORGANIZATIONS,
    GET_ORGANIZATIONS,
    ADD_ORGANIZATION,
    UPDATE_ORGANIZATION,
    SAVING_ORGANIZATION,
    DELETE_ORGANIZATION,
    ORGANIZATIONS_LOADING,
    LOGOUT_SUCCESS,
    SAVING_ORGANIZATION_CANCEL
} from '../actions/types';

const initialState = {
    organizations: [],
    organizationsLoading: false,
    organizationsLoaded: false,
    organizationSaving: false,
    next: '/api/organizations',
    q: ''
}

const reduceUpdatedOrganizations = (organizations,payload) => {
    const i = organizations.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedOrganizations = [...organizations]
    reducedOrganizations[i] = payload
    return reducedOrganizations
}

export default function organizationReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case FILTER_ORGANIZATIONS:
            return {
                ...state,
                q: action.payload.q,
                next: `${initialState.next}?q=${action.payload.q}`,
                organizations: [],
                organizationsLoading: true,
                organizationsLoaded: false
            }
        case GET_ORGANIZATIONS:
            return {
                ...state,
                organizations: state.organizations.concat(action.payload.organizations),
                organizationsLoading: false,
                organizationsLoaded: true,
                next: action.payload.next
            };
        case DELETE_ORGANIZATION:
            return {
                ...state,
                organizations: state.organizations.filter(organization => organization._id !== action.payload)
            };
        case ADD_ORGANIZATION:
            return {
                ...state,
                organizations: [action.payload, ...state.organizations],
                organizationSaving: false
            }
        case UPDATE_ORGANIZATION:
            return {
                ...state,
                organizations: reduceUpdatedOrganizations(state.organizations,action.payload),
                organizationSaving: false
            }
        case SAVING_ORGANIZATION:
            return {
                ...state,
                organizationSaving: true
            }
        case SAVING_ORGANIZATION_CANCEL:
            return {
                ...state,
                organizationSaving: false
            }
        case ORGANIZATIONS_LOADING:
            return {
                ...state,
                organizationsLoading: true
            }
        default:
            return state;
    }
}