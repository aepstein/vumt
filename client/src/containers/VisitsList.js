import React, { useEffect } from 'react';
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
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getVisits, deleteVisit } from '../actions/visitActions';
import { PropTypes } from 'prop-types';

function VisitsList() {
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const visitsLoaded = useSelector(state => state.visit.visitsLoaded)

    const dispatch = useDispatch()
    
    const onDeleteClick = (id) => {
        dispatch(deleteVisit(id))
    }

    useEffect(() => {
        if (!visitsLoaded) {
            dispatch(getVisits())
        }
    })

    return <div>
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
                                    onClick={() => onDeleteClick(_id)}
                                >&times;</Button>
                                {name}
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
        </Container>
    </div>
}

VisitsList.propTypes = {
    visits: PropTypes.array.isRequired
}

export default VisitsList;