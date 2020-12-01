import React from 'react';
import LoginForm from '../../components/auth/LoginForm'
import { useSelector } from 'react-redux'

function LoginManager() {
    const error = useSelector(state => state.error)
    const saving = useSelector(state => state.auth.saving)

    return <LoginForm error={error} saving={saving} />
}

export default LoginManager;