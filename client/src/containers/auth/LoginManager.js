import React from 'react';
import LoginForm from '../../components/auth/LoginForm'
import { useSelector } from 'react-redux'

function LoginManager() {
    const notice = useSelector(state => state.notice)
    const saving = useSelector(state => state.auth.saving)

    return <LoginForm notice={notice} saving={saving} />
}

export default LoginManager;