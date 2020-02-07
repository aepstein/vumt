import React from 'react';
import { useHistory } from 'react-router-dom'
import {
    Button,
    Container,
    Table
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import { deleteUser } from '../../actions/userActions';

export default function UsersList({users}) {
    const authUser = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('user')

    const onDeleteClick = (id) => {
        dispatch(deleteUser(id))
    }

    return <div>
        <Container>
            <Link to="/users/new">
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addUser')}</Button>
            </Link>
            <Table responsive={true} className="users-list">
                <thead>
                    <tr>
                        <th colspan="3"></th>
                        <th>{t('commonForms:firstName')}</th>
                        <th>{t('commonForms:lastName')}</th>
                        <th>{t('commonForms:email')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(({_id,firstName,lastName,email}) =>
                        <tr>
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
        </Container>
    </div>
}
