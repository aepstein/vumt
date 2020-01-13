import React from 'react';
import { Container } from 'reactstrap';
import './UserDashboard.css';
import VisitsManager from '../containers/visits/VisitsManager';

function UserDashboard() {
  return <div className="UserDashboard">
    <Container>
        <VisitsManager />
    </Container>
  </div>
}

export default UserDashboard
