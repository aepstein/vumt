import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import geoReducer from './geoReducer'
import advisoryReducer from './advisoryReducer';
import districtReducer from './districtReducer'
import placeReducer from './placeReducer'
import userReducer from './userReducer'
import visitReducer from './visitReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    geo: geoReducer,
    advisory: advisoryReducer,
    district: districtReducer,
    place: placeReducer,
    user: userReducer,
    visit: visitReducer
})