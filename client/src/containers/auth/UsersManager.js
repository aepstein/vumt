import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import { register as registerUser } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import UserEditor from '../../components/users/UserEditor'

function RegisterUser({action}) {
    const { defaultAction, userId } = useParams()
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const dispatch = useDispatch()

    const history = useHistory()

    const [saving,setSaving] = useState(false)

    const [user,setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: '',
        provice: '',
        postalCode: ''
    })

    useEffect(() => {
        if (isAuthenticated && saving) {
            setSaving(false)
            history.push('/')
        }
    },[isAuthenticated,saving])

    const onSave = (newProps) => {
        if (saving) return
        setSaving(true)
        dispatch(clearErrors())
        dispatch(registerUser(newProps))
    }

    switch(action ? action : defaultAction) {
        default:
            return <UserEditor user={user} onSave={onSave} saving={saving} />
    }
}

export default RegisterUser;