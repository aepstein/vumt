import React, { Component } from 'react';
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';
// TODO remove UUID after connection to backend is complete
import uuid from 'uuid';

class VisitsList extends Component {
    state = {
        visits: [
            { id: uuid(), name: 'Algonquin' },
            { id: uuid(), name: 'Pitchoff' },
            { id: uuid(), name: 'Hadley' },
            { id: uuid(), name: 'Owl\'s Head' },
        ]
    }
    render() {
        const { visits } = this.state;
        return(
            <Container>
                <Button
                    color="dark"
                    style={{marginBottom: '2rem'}}
                    onClick={() => {
                        const name = prompt('Enter name for new visit');
                        if (name) {
                            this.setState( (state) => ({
                                visits: [...state.visits, {id: uuid(), name}]
                            }))
                        }
                    }}
                >Add Visit</Button>
                <ListGroup>
                    <TransitionGroup className="visits-list">
                        {visits.map(({ id, name }) => (
                            <CSSTransition
                                key={id}
                                timeout={500}
                                classNames="fade"
                            >
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        style={{marginRight: '0.5rem'}}
                                        onClick={() => 
                                            this.setState(state => ({
                                                visits: state.visits.filter(visit => visit.id !== id)
                                            }))
                                        }
                                    >&times;</Button>
                                    {name}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

export default VisitsList;