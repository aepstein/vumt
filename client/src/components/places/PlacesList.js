import React from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Container,
    ListGroup,
    ListGroupItem,
    Spinner
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import useScrollDown from '../../hooks/useScrollDown'
import Search from '../search/Search'

export default function PlacesList({places,loading,next,q,onDelete,onLoadMore,onSearch}) {
    const history = useHistory()
    
    const { t } = useTranslation('place')

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
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
                                onClick={() => onDelete(_id)}
                            >{t('commonForms:remove')}</Button>
                        </ButtonGroup>
                        <span className="place-label">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary" /> : ''}
        </Container>
    </div>
}
