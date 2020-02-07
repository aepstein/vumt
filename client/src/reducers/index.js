import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import userReducer from './userReducer'
import visitReducer from './visitReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    user: userReducer,
    visit: visitReducer
})