import React from 'react';
import { useHistory, Link } from 'react-router-dom'
import {
    Button,
    ButtonGroup,
    Container,
    ListGroup,
    ListGroupItem,
    Spinner
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import useScrollDown from '../../hooks/useScrollDown'
import Search from '../search/Search'

export default function DistrictsList({districts,loading,next,q,onDelete,onLoadMore,onSearch}) {
    const history = useHistory()
    
    const { t } = useTranslation(['district','search','translation'])

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to="/districts/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addDistrict')}</Button>
            </Link>
            <ListGroup className="districts-list">
                {districts.map(({ _id, name }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/districts/' + _id)}
                            >{t('translation:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/districts/' + _id + '/edit')}
                            >{t('translation:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDelete(_id)}
                            >{t('translation:remove')}</Button>
                        </ButtonGroup>
                        <span className="district-name">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
