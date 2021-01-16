import React, { useState } from 'react';
import {
    Button,
    Container,
    Form,
    FormGroup,
    FormFeedback,
    Label,
    Input,
    Spinner
} from 'reactstrap';
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { cancelLogin, resetPassword } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'

function ResetPasswordForm({saving,email,token}) {
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    
    const { t } = useTranslation()

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

    if (saving) {
        return <Container><Spinner color="secondary"/></Container>
    }

    return <Container>
        <h1>{t('resetPassword')}</h1>
        <p>{t('resetPasswordConfirmInstructions')}</p>
        <Form onSubmit={onSubmit}>
            <FormGroup>
                <Label for="password">{t('translation:password')}</Label>
                <Input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder={t('password')}
                    innerRef={register({required: true})}
                    onChange={onChange(setPassword)}
                    invalid={errors.password ? true : false}
                />
                {errors.password && errors.password.type === 'required' &&
                    <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
            </FormGroup>
            <Button
                disabled={saving}
                color="dark"
                style={{marginTop: '2rem'}}
                block
            >{t('resetPassword')}</Button>
            <Button color="link" disabled={saving} onClick={onCancel}>{t('translation:cancel')}</Button>
        </Form>
    </Container>
}

export default ResetPasswordForm;