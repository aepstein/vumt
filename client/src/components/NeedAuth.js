import React, { Component } from 'react';
import { Container } from 'reactstrap';

class NeedAuth extends Component {
  render() {
    return (
      <div className="NeedAuth">
        <Container>
          <p>You must log in to use this system</p>
        </Container>
      </div>
    );
  }
}

export default NeedAuth
