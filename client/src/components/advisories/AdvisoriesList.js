import React from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Container,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteAdvisory } from '../../actions/advisoryActions';

export default function AdvisoriesList({advisories}) {
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('advisory')

    const onDeleteClick = (id) => {
        dispatch(deleteAdvisory(id))
    }

    return <div>
        <Container>
            <Link to="/advisories/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addAdvisory')}</Button>
            </Link>
            <ListGroup className="advisories-list">
                {advisories.map(({ _id, label }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/advisories/' + _id)}
                            >{t('commonForms:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/advisories/' + _id + '/edit')}
                            >{t('commonForms:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDeleteClick(_id)}
                            >{t('commonForms:remove')}</Button>
                        </ButtonGroup>
                        <span className="advisory-label">{label}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    </div>
}
