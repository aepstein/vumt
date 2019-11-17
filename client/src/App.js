import React, { Component } from 'react';
import { Container } from 'reactstrap';
// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import AppNavbar from './components/AppNavbar'
import VisitsList from './components/VisitsList'
import VisitModal from './components/VisitModal';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <Container>
              <VisitModal />
              <VisitsList />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;
