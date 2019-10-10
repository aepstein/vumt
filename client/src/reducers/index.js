import { combineReducers } from 'redux';
import visitReducer from './visitReducer';

export default combineReducers({
    visit: visitReducer
})