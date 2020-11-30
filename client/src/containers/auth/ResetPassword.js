import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    Alert,
    Spinner
} from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { cancelLogin, resetPassword } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import axios from 'axios'

function ResetPassword() {
    const {email,token} = useParams()

    const [password, setPassword] = useState('')
    const [checkingToken, setCheckingToken] = useState(false)
    const [checkedToken, setCheckedToken] = useState(false)
    const [verifiedToken,setVerifiedToken] = useState('')
    const [tokenCode,setTokenCode] = useState('')
    const [msg, setMsg] = useState(null)

    const error = useSelector(state => state.error)
 
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation('AppNavbar')

    const saving = useSelector((state) => state.auth.saving)

    useEffect(() => {
        if (checkingToken || checkedToken) { return }
        setCheckingToken(true)
        axios.get('/api/auth/resetPassword/' + email + '/' + token)
        .then((res) => {
            setVerifiedToken(true)
        })
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.code) {
                setTokenCode(err.response.data.code)
            }
        })
        .finally(() => {
            setCheckedToken(true)
            setCheckingToken(false)
        })
    },[email,token,checkingToken,checkedToken,setCheckingToken,setCheckedToken,setVerifiedToken,setTokenCode])

    const { register, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(clearErrors())
        dispatch(resetPassword({email,token,password}))
    }
    const onCancel = (e) => {
        e.preventDefault()
        dispatch(clearErrors())
        dispatch(cancelLogin(history))
    }

    useEffect(() => {
        if (error.id === 'LOGIN_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    },[error])

    if (!checkedToken) {
        return <Container><Spinner color="secondary"/></Container>
    }

    if (!verifiedToken) {
        return <Container>{t(`resetPasswordTokenError:${tokenCode}`)}</Container>
    }

    return <Container>
        <h1>{t('resetPassword')}</h1>
        {msg ? <Alert color="danger">{msg}</Alert> : null }
        <p>{t('resetPasswordConfirmInstructions')}</p>
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label for="password">{t('commonForms:password')}</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={t('password')}
                    innerRef={register({required: true})}
                    onChange={onChange(setPassword)}
                    invalid={errors.password ? true : false}
                />
                {errors.password && errors.password.type === 'required' &&
                    <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
            </FormGroup>
            <Button
                disabled={saving}
                color="dark"
                style={{marginTop: '2rem'}}
                block
            >{t('resetPassword')}</Button>
            <Button color="link" disabled={saving} onClick={onCancel}>{t('cancel')}</Button>
        </Form>
    </Container>
}

export default ResetPassword;