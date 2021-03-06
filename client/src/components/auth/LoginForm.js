import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Container,
    Input,
    Form,
    FormGroup,
    Label,
    Spinner
} from 'reactstrap';
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login, cancelLogin } from '../../actions/authActions';
import { clearNotices } from '../../actions/noticeActions';
import { useDispatch } from 'react-redux'

function LoginForm({saving,notice}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState(null)
 
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const user = {
            email,
            password
        }
        dispatch(clearNotices())
        dispatch(login(user,history))
    }
    const onCancel = (e) => {
        e.preventDefault()
        dispatch(clearNotices())
        dispatch(cancelLogin(history))
    }

    useEffect(() => {
        if (notice.id === 'LOGIN_FAIL') {
            setMsg(notice.msg.msg)
        } else {
            setMsg(null)
        }
    },[notice])

    if (saving) {
        return <Container>
            <p>{t('checkingCredentials')}</p>
            <Spinner color="secondary"/>
        </Container>
    }

    return <Container>
        <h1>{t('login')}</h1>
        {msg ? <Alert color="danger">{msg}</Alert> : null }
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label for="email">{t('translation:email')}</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    placeholder={t('translation:emailPlaceholder')}
                    onChange={onChange(setEmail)}
                    className="mb-3"
                />
                <Label for="password">{t('translation:password')}</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder={t('translation:password')}
                    onChange={onChange(setPassword)}
                    className="mb-3"
                />
                <Button
                    color="dark"
                    style={{marginTop: '2rem'}}
                    block
                >{t('login')}</Button>
                <Button color="link" onClick={onCancel}>{t('translation:cancel')}</Button>
            </FormGroup>
        </Form>
        <p>{t('forgotPassword')} <Link to="/resetPassword">{t('resetPassword')}</Link></p>
    </Container>
}

export default LoginForm