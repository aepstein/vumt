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
import { connect } from 'react-redux';
import { getVisits, deleteVisit } from '../actions/visitActions';
import { PropTypes } from 'prop-types';

class VisitsList extends Component {
    componentDidMount() {
        this.props.getVisits()
    }

    onDeleteClick = (id) => {
        this.props.deleteVisit(id);
    }


    render() {
        const { visits } = this.props.visit;
        return(
            <Container>
                <ListGroup>
                    <TransitionGroup className="visits-list">
                        {visits.map(({ _id, name }) => (
                            <CSSTransition
                                key={_id}
                                timeout={500}
                                classNames="fade"
                            >
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        style={{marginRight: '0.5rem'}}
                                        onClick={this.onDeleteClick.bind(this,_id)}
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

export default connect(
    mapStateToProps,
    { 
        getVisits,
        deleteVisit
    }
)(VisitsList);