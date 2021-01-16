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
import Search from '../search/Search'
import useScrollDown from '../../hooks/useScrollDown'

export default function AdvisoriesList({advisories,loading,next,q,onDelete,onLoadMore,onSearch}) {
    const history = useHistory()
    
    const { t } = useTranslation(['advisory','search','translation'])

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
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
                            >{t('translation:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/advisories/' + _id + '/edit')}
                            >{t('translation:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDelete(_id)}
                            >{t('translation:remove')}</Button>
                        </ButtonGroup>
                        <span className="advisory-label">{label}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {loading ? <Spinner color="secondary"/> : ''}
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
        </Container>
    </div>
}
