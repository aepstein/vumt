import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import geoReducer from './geoReducer'
import advisoryReducer from './advisoryReducer';
import districtReducer from './districtReducer'
import membershipReducer from './membershipReducer'
import organizationReducer from './organizationReducer'
import placeReducer from './placeReducer'
import userReducer from './userReducer'
import visitReducer from './visitReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    geo: geoReducer,
    advisory: advisoryReducer,
    district: districtReducer,
    membership: membershipReducer,
    organization: organizationReducer,
    place: placeReducer,
    user: userReducer,
    visit: visitReducer
})