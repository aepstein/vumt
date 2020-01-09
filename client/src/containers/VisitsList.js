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
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { getVisits, deleteVisit } from '../actions/visitActions';
import { PropTypes } from 'prop-types';

function VisitsList() {
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const visitsLoading = useSelector(state => state.visit.visitsLoading)
    const visitsLoaded = useSelector(state => state.visit.visitsLoaded)

    const dispatch = useDispatch()
    
    const { t } = useTranslation('visit')

    const onDeleteClick = (id) => {
        dispatch(deleteVisit(id))
    }

    useEffect(() => {
        if (!visitsLoading && !visitsLoaded) {
            dispatch(getVisits())
        }
    })

    return <div>
        <Container>
            <Link to="/visits/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addVisit')}</Button>
            </Link>
            <ListGroup>
                <TransitionGroup className="visits-list">
                    {visits.map(({ _id, origin, destinations }) => (
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
                                <em>{t('From')}</em> <strong>{origin.name}</strong> <em>{t('To')}</em> <strong>{destinations.map(d => d.name).join(', ')}</strong>
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