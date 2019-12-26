import React from 'react';
import { Container } from 'reactstrap';
import './UserDashboard.css';
import VisitsList from './VisitsList';
import VisitModal from './VisitModal';

function UserDashboard() {
  return <div className="UserDashboard">
    <Container>
        <VisitModal />
        <VisitsList />
    </Container>
  </div>
}

export default UserDashboard
