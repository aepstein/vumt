import React, { Component } from 'react';
import { Container } from 'reactstrap';
// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import { connect } from 'react-redux';
import './App.css';
import AppNavbar from './components/AppNavbar';
import VisitsList from './components/VisitsList';
import VisitModal from './components/VisitModal';
import { loadUser } from './actions/authActions';

class App extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    return (
      <div className="App">
        <AppNavbar />
        <Container>
            <VisitModal />
            <VisitsList />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state
});

export default connect(
  mapStateToProps,
  { 
      loadUser
  }
)(App);
