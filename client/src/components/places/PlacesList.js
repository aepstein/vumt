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
import { deletePlace } from '../../actions/placeActions';

export default function PlacesList({places}) {
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('place')

    const onDeleteClick = (id) => {
        dispatch(deletePlace(id))
    }

    return <div>
        <Container>
            <Link to="/places/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addPlace')}</Button>
            </Link>
            <ListGroup className="places-list">
                {places.map(({ _id, name }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/places/' + _id)}
                            >{t('commonForms:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/places/' + _id + '/edit')}
                            >{t('commonForms:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDeleteClick(_id)}
                            >{t('commonForms:remove')}</Button>
                        </ButtonGroup>
                        <span className="place-label">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    </div>
}
