import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Alert,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { cancelLogin, requestResetPassword, requestResetPasswordContinue } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

function ResetPasswordRequest() {
    const {initEmail} = useParams()
    const [email, setEmail] = useState(initEmail ? decodeURIComponent(initEmail) : '')
    const [msg, setMsg] = useState(null)

    const error = useSelector(state => state.error)
 
    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t, i18n } = useTranslation(['translation'])

    const saving = useSelector((state) => state.auth.saving)
    const resetPasswordEmail = useSelector((state) => state.auth.resetPasswordEmail)

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(clearErrors())
        dispatch(requestResetPassword(email,i18n.language))
    }
    const onCancel = (e) => {
        e.preventDefault()
        dispatch(clearErrors())
        dispatch(cancelLogin(history))
    }
    const onComplete = (e) => {
        e.preventDefault()
        dispatch(requestResetPasswordContinue(history))
    }

    useEffect(() => {
        if (error.id === 'LOGIN_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    },[error])

    return <Container>
        <h1>{t('resetPassword')}</h1>
        {msg ? <Alert color="danger">{msg}</Alert> : null }
        <p>{t('resetPasswordInstructions')}</p>
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label for="email">{t('email')}</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    placeholder={t('emailPlaceholder')}
                    onChange={onChange(setEmail)}
                    className="mb-3"
                />
                <Button
                    disabled={saving}
                    color="dark"
                    style={{marginTop: '2rem'}}
                    block
                >{t('resetPassword')}</Button>
                <Button color="link" disabled={saving} onClick={onCancel}>{t('cancel')}</Button>
            </FormGroup>
        </Form>
        <Modal isOpen={resetPasswordEmail !== null}>
            <ModalHeader>{t('resetPasswordRequestSent')}</ModalHeader>
            <ModalBody>{t('resetPasswordRequestSentTo',{email: resetPasswordEmail})}</ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onComplete}>{t('continue')}</Button>
            </ModalFooter>
        </Modal>
    </Container>
}

export default ResetPasswordRequest;