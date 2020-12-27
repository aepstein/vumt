import {
    FILTER_USERS,
    GET_USERS,
    ADD_USER,
    UPDATE_USER,
    SAVING_USER,
    DELETE_USER,
    USERS_LOADING,
    LOGOUT_SUCCESS,
    SAVING_USER_CANCEL
} from '../actions/types';

const initialState = {
    q: '',
    users: [],
    usersLoading: false,
    usersLoaded: false,
    next: '/api/users',
    userSaving: false
}

const reduceUpdatedUsers = (users,payload) => {
    const i = users.reduce((pre,cur,i) => {
        if (cur._id === payload._id) return i
        return pre
    },-1)
    const reducedUsers = [...users]
    reducedUsers[i] = payload
    return reducedUsers
}

export default function userReducer( state = initialState, action ) {
    switch(action.type) {
        case LOGOUT_SUCCESS:
            return {
                ...state,
                ...initialState
            }
        case FILTER_USERS:
            return {
                ...state,
                q: action.payload.q,
                next: `${initialState.next}?q=${action.payload.q}`,
                users: [],
                usersLoading: true,
                usersLoaded: false
            }
        case GET_USERS:
            return {
                ...state,
                next: action.payload.next,
                users: state.users.concat(action.payload.users),
                usersLoading: false,
                usersLoaded: true
            };
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload)
            };
        case ADD_USER:
            return {
                ...state,
                users: [action.payload, ...state.users],
                userSaving: false
            }
        case UPDATE_USER:
            return {
                ...state,
                users: reduceUpdatedUsers(state.users,action.payload),
                userSaving: false
            }
        case SAVING_USER:
            return {
                ...state,
                userSaving: true
            }
        case SAVING_USER_CANCEL:
            return {
                ...state,
                userSaving: false
            }
        case USERS_LOADING:
            return {
                ...state,
                usersLoading: true
            }
        default:
            return state;
    }
}