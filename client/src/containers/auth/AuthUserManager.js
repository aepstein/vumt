import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { register as registerUser, update as updateUser } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import UserEditor from '../../components/users/UserEditor'
import UserDetail from '../../components/users/UserDetail'

export default function AuthUserManager({action}) {
    const { defaultAction } = useParams()
    const authUser = useSelector(state => state.auth.user)
    const saving = useSelector(state => state.auth.saving)

    const dispatch = useDispatch()

    const history = useHistory()

    const [user,setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
        provice: '',
        postalCode: '',
        phone: '',
        roles: []
    })

    useEffect(() => {
        if (authUser) setUser(authUser)
    },[authUser,setUser])

    const onSave = (newProps) => {
        if (saving) return
        dispatch(clearErrors())
        if (user._id) {
            dispatch(updateUser(user,newProps,history))
        }
        else {
            dispatch(registerUser(newProps,history))
        }
    }

    switch(action ? action : defaultAction) {
        case "show":
            return <UserDetail user={user} />
        case "edit":
            return <UserEditor user={user} onSave={onSave} saving={saving} action="edit" />
        default:
            return <UserEditor user={user} onSave={onSave} saving={saving} />
    }
}
