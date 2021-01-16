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

export default function OrganizationsList({organizations,loading,next,q,onDelete,onLoadMore,onSearch}) {
    const history = useHistory()
    
    const { t } = useTranslation('organization')

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to="/organizations/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addOrganization')}</Button>
            </Link>
            <ListGroup className="organizations-list">
                {organizations.map(({ _id, name }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/organizations/' + _id)}
                            >{t('commonForms:detail')}</Button>
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/organizations/' + _id + '/memberships')}
                            >{t('membership:memberships')}</Button>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => history.push('/organizations/' + _id + '/edit')}
                            >{t('commonForms:edit')}</Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDelete(_id)}
                            >{t('commonForms:remove')}</Button>
                        </ButtonGroup>
                        <span className="organization-name">{name}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
