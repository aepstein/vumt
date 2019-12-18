import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'

function AuthRoute({ children, auth, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.isAuthenticated ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/need-auth",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

AuthRoute.propTypes = {
    auth: PropTypes.object
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(AuthRoute);
