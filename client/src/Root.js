// import 'bootstrap/dist/css/boostrap.min.css'
// import 'bootstrap-v4-rtl/dist/css/bootstrap.min.css'
import 'bootswatch/dist/sketchy/bootstrap.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import NeedAuth from './components/NeedAuth'
import AuthRoute from './components/AuthRoute'
import UnAuthRoute from './components/UnAuthRoute'
import VisitsManager from './containers/visits/VisitsManager'
import RegisterUser from './containers/RegisterUser'
import UserDashboard from './containers/UserDashboard'
import AppNavbar from './containers/AppNavbar';
import './i18n'
import DirectionProvider from './components/DirectionProvider'
import Spinner from './components/Spinner'

const Root = ({ store }) => (
    <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <DirectionProvider>
            <Router>
            <AppNavbar />
            <Switch>
              <UnAuthRoute path="/need-auth">
                <NeedAuth />
              </UnAuthRoute>
              <UnAuthRoute path="/register">
                <RegisterUser />
              </UnAuthRoute>
              <AuthRoute path="/visits/new">
                <VisitsManager action='new'/>
              </AuthRoute>
              <AuthRoute path="/visits/:visitId/edit">
                <VisitsManager action='edit'/>
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