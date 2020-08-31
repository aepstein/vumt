// import 'bootstrap/dist/css/boostrap.min.css'
// import 'bootstrap-v4-rtl/dist/css/bootstrap.min.css'
import 'bootswatch/dist/sketchy/bootstrap.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import NeedAuth from './components/NeedAuth'
import AuthRoute from './components/AuthRoute'
import UnAuthRoute from './components/UnAuthRoute'
import AdvisoriesManager from './containers/advisories/AdvisoriesManager'
import DistrictsManager from './containers/districts/DistrictsManager'
import PlacesManager from './containers/places/PlacesManager'
import UsersManager from './containers/users/UsersManager'
import VisitsManager from './containers/visits/VisitsManager'
import AuthUserManager from './containers/auth/AuthUserManager'
import UserDashboard from './containers/UserDashboard'
import AppNavbar from './containers/AppNavbar';
import AlertsManager from './containers/AlertsManager'
import './i18n'
import DirectionProvider from './components/DirectionProvider'
import { Spinner } from 'reactstrap'

const Root = ({ store }) => (
    <Provider store={store}>
        <Suspense fallback={<Spinner color="primary" />}>
          <DirectionProvider>
            <Router>
            <AppNavbar />
            <AlertsManager />
            <Switch>
              <UnAuthRoute path="/need-auth">
                <NeedAuth />
              </UnAuthRoute>
              <UnAuthRoute path="/register">
                <AuthUserManager action="register" />
              </UnAuthRoute>
              <AuthRoute path="/profile/edit">
                <AuthUserManager action="edit" />
              </AuthRoute>
              <AuthRoute path="/profile">
                <AuthUserManager action="show" />
              </AuthRoute>
              <AuthRoute path="/advisories/new" roles={['admin']}>
                <AdvisoriesManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/advisories/:advisoryId/edit" roles={['admin']}>
                <AdvisoriesManager action='edit'/>
              </AuthRoute>
              <AuthRoute path="/advisories/:advisoryId" roles={['admin']}>
                <AdvisoriesManager action='show'/>
              </AuthRoute>
              <AuthRoute path="/advisories" roles={['admin']}>
                <AdvisoriesManager action='list'/>
              </AuthRoute>
              <AuthRoute path="/districts/new" roles={['admin']}>
                <DistrictsManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/districts/:districtId/edit" roles={['admin']}>
                <DistrictsManager action='edit'/>
              </AuthRoute>
              <AuthRoute path="/districts/:districtId" roles={['admin']}>
                <DistrictsManager action='show'/>
              </AuthRoute>
              <AuthRoute path="/districts" roles={['admin']}>
                <DistrictsManager action='list'/>
              </AuthRoute>
              <AuthRoute path="/places/new" roles={['admin']}>
                <PlacesManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/places/:placeId/edit" roles={['admin']}>
                <PlacesManager action='edit'/>
              </AuthRoute>
              <AuthRoute path="/places/:placeId" roles={['admin']}>
                <PlacesManager action='show'/>
              </AuthRoute>
              <AuthRoute path="/places" roles={['admin']}>
                <PlacesManager action='list'/>
              </AuthRoute>
              <AuthRoute path="/users/new" roles={['admin']}>
                <UsersManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/users/:userId/edit" roles={['admin']}>
                <UsersManager action='edit'/>
              </AuthRoute>
              <AuthRoute path="/users/:userId" roles={['admin']}>
                <UsersManager action='show'/>
              </AuthRoute>
              <AuthRoute path="/users" roles={['admin']}>
                <UsersManager action='list'/>
              </AuthRoute>
              <AuthRoute path="/visits/new">
                <VisitsManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/visits/:visitId/edit">
                <VisitsManager action='edit'/>
              </AuthRoute>
              <AuthRoute path="/visits/:visitId/checkIn">
                <VisitsManager action='checkIn'/>
              </AuthRoute>
              <AuthRoute path="/visits/:visitId/checkOut">
                <VisitsManager action='checkOut'/>
              </AuthRoute>
              <AuthRoute path="/visits/:visitId">
                <VisitsManager action='show'/>
              </AuthRoute>
              <AuthRoute exact path="/">
                <UserDashboard />
              </AuthRoute>
            </Switch>
          </Router>
        </DirectionProvider>
      </Suspense>
    </Provider>
)

export default Root