import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import placeReducer from './placeReducer'
import userReducer from './userReducer'
import visitReducer from './visitReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    place: placeReducer,
    user: userReducer,
    visit: visitReducer
})