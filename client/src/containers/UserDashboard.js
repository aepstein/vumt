import React from 'react';
import { Container } from 'reactstrap';
import './UserDashboard.css';
import VisitsList from './VisitsList';

function UserDashboard() {
  return <div className="UserDashboard">
    <Container>
        <VisitsList />
    </Container>
  </div>
}

export default UserDashboard
