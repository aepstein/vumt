import React, { useCallback } from 'react';
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
import useAuthorized from '../../hooks/useAuthorized'
import { Link } from 'react-router-dom';
import VisitCheckButton from './VisitCheckButton'
import Search from '../search/Search'
import useScrollDown from '../../hooks/useScrollDown'

export default function VisitsList({loading,next,q,visits,onCancel,onDelete,onLoadMore,onSearch}) {
    const auth = useAuthorized()
    const history = useHistory()

    const mayModify = useCallback((user) => {
        return auth({roles: ['admin'], user})
    },[auth])
    const mayDelete = useCallback(() => {
        return auth({roles: ['admin']})
    },[auth])
    
    const { t, i18n } = useTranslation(['visit','search','translation'])

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to="/visits/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addVisit')}</Button>
            </Link>
            <ListGroup className="visits-list">
                {visits.map(({ _id, user, startOn, origin, destinations, checkedIn, checkedOut, cancelled }) => (
                    <ListGroupItem key={_id}>
                        <ButtonGroup>
                            <VisitCheckButton visitId={_id} checkedIn={checkedIn} checkedOut={checkedOut} />
                            <Button
                                color="info"
                                size="sm"
                                onClick={() => history.push('/visits/' + _id)}
                            >{t('translation:detail')}</Button>
                            {mayModify(user) ? <Button
                                color="warn"
                                size="sm"
                                onClick={() => {
                                    console.log(_id)
                                    history.push('/visits/' + _id + '/edit')
                                }}
                            >{t('translation:edit')}</Button> : ''}
                            {!cancelled && mayModify(user) ? <Button
                                color="danger"
                                size="sm"
                                onClick={() => onCancel(_id)}
                            >{t('translation:cancel')}</Button> : '' }
                            {mayDelete() ? <Button
                                color="danger"
                                size="sm"
                                onClick={() => onDelete(_id)}
                            >{t('translation:remove')}</Button> : ''}
                        </ButtonGroup>
                        <span className="visit-label">
                        <strong>{i18n.language && startOn ? Intl.DateTimeFormat(i18n.language,{timeZone: origin.timezone}).format(startOn) : ''}</strong>:&nbsp;<em>{t('From')}</em> <strong>{origin.name}</strong> <em>{t('To')}</em> <strong>{destinations.map(d => d.name).join(', ')}</strong>
                        </span>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {loading ? <Spinner color="secondary"/> : ''}
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
        </Container>
    </div>
}
