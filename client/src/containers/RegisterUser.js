import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
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

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            firstName,
            lastName,
            email,
            password
        }
        dispatch(clearErrors())
        dispatch(register(newUser))
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
                onSubmit={onSubmit}
            >
                <FormGroup>
                    <Label for="firstName">{t('firstName')}</Label>
                    <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={t('firstName')}
                        onChange={onChange(setFirstName)}
                        className="mb-3"
                    />
                    <Label for="lastName">{t('lastName')}</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t('lastName')}
                        onChange={onChange(setLastName)}
                        className="mb-3"
                    />
                    <Label for="email">{t('email')}</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t('emailPlaceholder')}
                        onChange={onChange(setEmail)}
                        className="mb-3"
                    />
                    <Label for="password">{t('password')}</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t('password')}
                        onChange={onChange(setPassword)}
                        className="mb-3"
                    />
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >{t('AppNavbar:register')}</Button>
                </FormGroup>
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