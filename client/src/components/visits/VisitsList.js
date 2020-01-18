import React from 'react';
import { useHistory } from 'react-router-dom'
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
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteVisit } from '../../actions/visitActions';

export default function VisitsList({visits}) {
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t, i18n } = useTranslation('visit')

    const onDeleteClick = (id) => {
        dispatch(deleteVisit(id))
    }

    return <div>
        <Container>
            <Link to="/visits/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addVisit')}</Button>
            </Link>
            <ListGroup>
                <TransitionGroup className="visits-list">
                    {visits.map(({ _id, startOn, origin, destinations }) => (
                        <CSSTransition
                            key={_id}
                            timeout={500}
                            classNames="fade"
                        >
                            <ListGroupItem>
                                <Button
                                    className="info-btn"
                                    color="info"
                                    size="sm"
                                    style={{marginRight: '0.5rem'}}
                                    onClick={() => history.push('/visits/' + _id)}
                                >{t('commonForms:detail')}</Button>
                                <Button
                                    className="warn-btn"
                                    color="warn"
                                    size="sm"
                                    style={{marginRight: '0.5rem'}}
                                    onClick={() => history.push('/visits/' + _id + '/edit')}
                                >{t('commonForms:edit')}</Button>
                                <Button
                                    className="remove-btn"
                                    color="danger"
                                    size="sm"
                                    style={{marginRight: '0.5rem'}}
                                    onClick={() => onDeleteClick(_id)}
                                >{t('commonForms:remove')}</Button>
                                <strong>{i18n.language && startOn ? Intl.DateTimeFormat(i18n.language).format(startOn) : ''}</strong>:&nbsp;
                                <em>{t('From')}</em> <strong>{origin.name}</strong> <em>{t('To')}</em> <strong>{destinations.map(d => d.name).join(', ')}</strong>
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
        </Container>
    </div>
}
