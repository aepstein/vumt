import React from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Container,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteVisit } from '../../actions/visitActions';
import VisitCheckButton from './VisitCheckButton'

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
                    {visits.map(({ _id, startOn, origin, destinations, checkedIn, checkedOut }) => (
                        <CSSTransition
                            key={_id}
                            timeout={500}
                            classNames="fade"
                        >
                            <ListGroupItem>
                                <ButtonGroup>
                                    <VisitCheckButton visitId={_id} checkedIn={checkedIn} checkedOut={checkedOut} />
                                    <Button
                                        color="info"
                                        size="sm"
                                        onClick={() => history.push('/visits/' + _id)}
                                    >{t('commonForms:detail')}</Button>
                                    <Button
                                        color="warn"
                                        size="sm"
                                        onClick={() => history.push('/visits/' + _id + '/edit')}
                                    >{t('commonForms:edit')}</Button>
                                    <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => onDeleteClick(_id)}
                                    >{t('commonForms:remove')}</Button>
                                </ButtonGroup>
                                <span className="visit-label">
                                <strong>{i18n.language && startOn ? Intl.DateTimeFormat(i18n.language,{timeZone: origin.timezone}).format(startOn) : ''}</strong>:&nbsp;<em>{t('From')}</em> <strong>{origin.name}</strong> <em>{t('To')}</em> <strong>{destinations.map(d => d.name).join(', ')}</strong>
                                </span>
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </ListGroup>
        </Container>
    </div>
}
