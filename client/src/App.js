import React from 'react';
import { Container } from 'reactstrap';
// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import AppNavbar from './components/AppNavbar'
import VisitsList from './components/VisitsList'
import VisitModal from './components/VisitModal';

import { Provider } from 'react-redux';
import store from './store';

function App() {
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

export default App;
