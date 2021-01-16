import React from 'react';
import { useHistory, Link } from 'react-router-dom'
import {
    Button,
    Container,
    Spinner,
    Table
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import useScrollDown from '../../hooks/useScrollDown'
import Search from '../search/Search'

export default function UsersList({authUser,users,next,loading,q,onSearch,onLoadMore,onDelete}) {
    const history = useHistory()
    
    const { t } = useTranslation(['translation','user','search'])

    useScrollDown(onLoadMore)

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to="/users/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('user:addUser')}</Button>
            </Link>
            <Table responsive={true} className="users-list">
                <thead>
                    <tr>
                        <th colSpan="3"></th>
                        <th>{t('firstName')}</th>
                        <th>{t('lastName')}</th>
                        <th>{t('email')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({_id,firstName,lastName,email}) =>
                        <tr key={_id}>
                            <td>
                                <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => history.push('/users/' + _id)}
                                >{t('detail')}</Button>
                            </td>
                            <td>
                                <Button
                                    color="warn"
                                    size="sm"
                                    onClick={() => history.push('/users/' + _id + '/edit')}
                                >{t('edit')}</Button>
                            </td>
                            <td>
                                { authUser._id === _id ? '' : 
                                    <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => onDelete(_id)}
                                    >{t('remove')}</Button>
                                }
                            </td>
                            <td>{firstName}</td>
                            <td>{lastName}</td>
                            <td>{email}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
