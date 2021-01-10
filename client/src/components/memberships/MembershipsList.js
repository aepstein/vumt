import React from 'react';
import { Link } from 'react-router-dom'
import {
    Button,
    Container,
    Spinner,
    Table
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import useScrollDown from '../../hooks/useScrollDown'
import Search from '../search/Search'

export default function MembershipsList({organization,memberships,loading,next,q,onDelete,onEdit,onLoadMore,onSearch}) {
    const { t } = useTranslation('membership')

    useScrollDown(onLoadMore)

    const newPath = () => {
        return `/organizations/${organization._id}/memberships/new`
    }

    if (!organization) { return <Spinner color="primary" /> }

    return <div>
        <Container>
            <Search q={q} onSearch={onSearch} />
            <Link to={newPath()}>
                <Button color="dark" style={{marginBottom: '2rem'}}>{t('addMembership')}</Button>
            </Link>
            <Table className="memberships">
                <thead>
                    <tr>
                        <th colSpan="2"></th>
                        <th>{t('user:user')}</th>
                        <th>{t('commonForms:email')}</th>
                        <th>{t('user:roles')}</th>
                    </tr>
                </thead>
                <tbody>
                {memberships.map(({ user, roles }) => (
                    <tr key={user._id}>
                        <td>
                            <Button
                                color="warn"
                                size="sm"
                                onClick={() => onEdit({user, roles})}
                            >{t('commonForms:edit')}</Button>
                        </td>
                        <td>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={onDelete(user._id)}
                            >{t('commonForms:remove')}</Button>
                        </td>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>{roles.join(',')}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {!loading && next ? <Button color="secondary" onClick={onLoadMore}>{t('search:more')}</Button> : ''}
            {loading ? <Spinner color="secondary"/> : ''}
        </Container>
    </div>
}
