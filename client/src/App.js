import React from 'react';
// import 'bootstrap/dist/css/boostrap.min.css';
import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import AppNavbar from './components/AppNavbar'
import VisitsList from './components/VisitsList'

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <VisitsList />
    </div>
  );
}

export default App;
