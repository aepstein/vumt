import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import { register as registerUser } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

function RegisterUser() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)

    const history = useHistory()

    const { t } = useTranslation('commonForms')

    const dispatch = useDispatch()

    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ msg, setMsg ] = useState(null)

    const { register, handleSubmit, watch, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        const newUser = {
            firstName,
            lastName,
            email,
            password
        }
        dispatch(clearErrors())
        dispatch(registerUser(newUser))
    }

    useEffect(() => {
        if (error.id === 'REGISTER_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    }, [error] )

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/")
        }
    }, [isAuthenticated])

    return <div>
        <Container>
            <h2>{t('AppNavbar:register')}</h2>
            {msg ? <Alert color="danger">{msg}</Alert> : null }
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="firstName">{t('firstName')}</Label>
                    <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={t('firstName')}
                        innerRef={register({required: true})}
                        onChange={onChange(setFirstName)}
                        invalid={errors.firstName}
                    />
                    {errors.firstName && errors.firstName.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">{t('lastName')}</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t('lastName')}
                        innerRef={register({required: true})}
                        onChange={onChange(setLastName)}
                        invalid={errors.lastName}
                    />
                    {errors.lastName && errors.lastName.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="email">{t('email')}</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t('emailPlaceholder')}
                        innerRef={register({required: true})}
                        onChange={onChange(setEmail)}
                        invalid={errors.email}
                    />
                    {errors.email && errors.email.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="password">{t('password')}</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t('password')}
                        innerRef={register({required: true})}
                        onChange={onChange(setPassword)}
                        invalid={errors.password}
                    />
                    {errors.password && errors.password &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{t('AppNavbar:register')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}

RegisterUser.propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}

export default RegisterUser;