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

export default function ThemesList({themes,loading,next,q,onDelete,onLoadMore,onSearch}) {
    const history = useHistory()
    
    const { t } = useTranslation(['theme','search','translation'])

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to="/themes/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addTheme')}</Button>
            </Link>
            <ListGroup className="themes-list">
                {themes.map(({ _id, name }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/themes/' + _id)}
                            >{t('translation:detail')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/themes/' + _id + '/edit')}
                            >{t('translation:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDelete(_id)}
                            >{t('translation:remove')}</Button>
                        </ButtonGroup>
                        <span className="theme-name">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
