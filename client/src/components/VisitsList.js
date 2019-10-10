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
import { connect } from 'react-redux';
import { getVisits } from '../actions/visitActions';
import { PropTypes } from 'prop-types';

class VisitsList extends Component {
    componentDidMount() {
        this.props.getVisits()
    }
    render() {
        const { visits } = this.props.visit;
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

VisitsList.propTypes = {
    getVisits: PropTypes.func.isRequired,
    visit: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    visit: state.visit
});

export default connect(mapStateToProps,{ getVisits })(VisitsList);