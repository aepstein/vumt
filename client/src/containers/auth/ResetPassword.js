import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Spinner
} from 'reactstrap';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { clearNotices, returnNotices } from '../../actions/noticeActions';
import axios from 'axios'

function ResetPassword() {
    const {email,token} = useParams()

    const [checkingToken, setCheckingToken] = useState(false)
    const [checkedToken, setCheckedToken] = useState(false)
    const [verifiedToken,setVerifiedToken] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation(['translation'])

    const saving = useSelector((state) => state.auth.saving)

    useEffect(() => {
        if (checkingToken || checkedToken) { return }
        setCheckingToken(true)
        axios.get('/api/auth/resetPassword/' + email + '/' + token)
        .then((res) => {
            setVerifiedToken(true)
        })
        .catch((err) => {
            if (err.response && err.response.data) {
                dispatch(returnNotices(err.response.data,err.response.status))
            }
        })
        .finally(() => {
            setCheckedToken(true)
            setCheckingToken(false)
        })
    },[email,token,checkingToken,checkedToken,setCheckingToken,setCheckedToken,setVerifiedToken,dispatch])

    const onResetAgain = (e) => {
        e.preventDefault()
        dispatch(clearNotices())
        history.push('/resetPassword/' + email)
    }

    if (!checkedToken) {
        return <Container><Spinner color="secondary"/></Container>
    }

    if (!verifiedToken) {
        return <Container>
            <Button color="primary" onClick={onResetAgain}>{t('resubmitPasswordResetRequest')}</Button>
        </Container>
    }

    return <ResetPasswordForm saving={saving} email={email} token={token}/>
}

export default ResetPassword;