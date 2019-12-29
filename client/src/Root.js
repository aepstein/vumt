// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import NeedAuth from './components/NeedAuth'
import AuthRoute from './components/AuthRoute'
import UnAuthRoute from './components/UnAuthRoute'
import NewVisit from './containers/NewVisit'
import RegisterUser from './containers/RegisterUser'
import UserDashboard from './containers/UserDashboard'
import AppNavbar from './containers/AppNavbar';
import './i18n'

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);


const Root = ({ store }) => (
    <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <Router>
          <AppNavbar />
          <Switch>
            <UnAuthRoute path="/need-auth">
            <NeedAuth />
            </UnAuthRoute>
            <UnAuthRoute path="/register">
              <RegisterUser />
            </UnAuthRoute>
            <AuthRoute exact path="/visits/new">
              <NewVisit />
            </AuthRoute>
            <AuthRoute exact path="/">
              <UserDashboard />
            </AuthRoute>
          </Switch>
        </Router>
      </Suspense>
    </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root