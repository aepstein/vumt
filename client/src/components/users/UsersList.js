import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    Container,
    Spinner,
    Table
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteUser, getUsers } from '../../actions/userActions';
import UserSearch from './UserSearch'

export default function UsersList({users,next,loading}) {
    const authUser = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('user')

    const onDeleteClick = (id) => {
        dispatch(deleteUser(id))
    }
    const loadMore = useCallback(() => {
        dispatch(getUsers)
    },[dispatch])

    useEffect(() => {
        const onMore = () => {
            if (loading || !next) { return }
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                loadMore()
            }
        }
        window.addEventListener("scroll",onMore)
        return () => {
            window.removeEventListener("scroll",onMore)
        }
    },[loading,next,loadMore])

    return <div>
        <Container>
            <UserSearch />
            <Link to="/users/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addUser')}</Button>
            </Link>
            <Table responsive={true} className="users-list">
                <thead>
                    <tr>
                        <th colSpan="3"></th>
                        <th>{t('commonForms:firstName')}</th>
                        <th>{t('commonForms:lastName')}</th>
                        <th>{t('commonForms:email')}</th>
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
                                >{t('commonForms:detail')}</Button>
                            </td>
                            <td>
                                <Button
                                    color="warn"
                                    size="sm"
                                    onClick={() => history.push('/users/' + _id + '/edit')}
                                >{t('commonForms:edit')}</Button>
                            </td>
                            <td>
                                { authUser._id === _id ? '' : 
                                    <Button
                                        color="danger"
                                        size="sm"
                                        onClick={() => onDeleteClick(_id)}
                                    >{t('commonForms:remove')}</Button>
                                }
                            </td>
                            <td>{firstName}</td>
                            <td>{lastName}</td>
                            <td>{email}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {!loading && next ? <Button color="secondary" onClick={loadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
