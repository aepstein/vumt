import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteUser, filterUsers, getUsers, saveUser } from '../../actions/userActions';
import UsersList from '../../components/users/UsersList'
import UserDetail from '../../components/users/UserDetail'
import UserEditor from '../../components/users/UserEditor'

const BLANK_USER = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    province: '',
    postalCode: '',
    phone: '',
    enableGeolocation: true,
    distanceUnitOfMeasure: 'mi',
    roles: []
}

export default function UsersManager({action}) {
    const { defaultAction, userId } = useParams()
    const authUser = useSelector(state => state.auth.user)
    const next = useSelector(state => state.user.next)
    const users = useSelector(state => state.user.users, shallowEqual)
    const loading = useSelector(state => state.user.usersLoading)
    const loaded = useSelector(state => state.user.usersLoaded)
    const saving = useSelector(state => state.user.userSaving)
    const q = useSelector(state => state.user.q)

    const [user,setUser] = useState(BLANK_USER)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onDelete = (id) => {
        dispatch(deleteUser(id))
    }
    const onLoadMore = () => {
        if (loading || !next) { return }
        dispatch(getUsers)
    }
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveUser(newProps,history))
    }
    const onSearch = (q) => {
        dispatch(filterUsers(q))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getUsers)
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (user && user._id === userId) return
        if (userId && loaded) {
            const loadedUser = users.filter(v => v._id === userId)[0]
            // TODO -- how to handle a user that does not match loaded users?
            if (!loadedUser) return
            setUser(loadedUser)
        }
        else {
            setUser(BLANK_USER)
        }
    },[user,userId,loaded,users])

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <UserEditor user={user} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <UserDetail user={user} />
        default:
            return <UsersList users={users} next={next} loading={loading} q={q} authUser={authUser}
                onDelete={onDelete} onLoadMore={onLoadMore} onSearch={onSearch} />
    }
}
