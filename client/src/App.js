import React, { Component } from 'react';
import { Container } from 'reactstrap';
// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import VisitsList from './components/VisitsList';
import VisitModal from './components/VisitModal';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
            <VisitModal />
            <VisitsList />
        </Container>
      </div>
    );
  }
}

export default App
