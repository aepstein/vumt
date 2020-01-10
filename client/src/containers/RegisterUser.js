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
import {
    Typeahead
} from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import countries from '../lib/countries'

import { register as registerUser } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

function RegisterUser() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)

    const history = useHistory()

    const { t, i18n } = useTranslation('commonForms')

    const dispatch = useDispatch()

    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ country, setCountry ] = useState('')
    const [ countryOptions, setCountryOptions ] = useState([])
    const [ msg, setMsg ] = useState(null)
    const [ language, setLanguage ] = useState('en')

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        dispatch(clearErrors())
        if (country.length === 0) {
            setError("country","required",t('invalidRequired'))
            return
        }
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            country: country[0].id
        }
        dispatch(registerUser(newUser))
    }

    useEffect(() => {
        const newLanguage = i18n.language ? i18n.language.substring(0,2) : 'en'
        if ( newLanguage != language ) {
            setLanguage(newLanguage)
        }
    })

    useEffect(() => {
        const newOptions = countries.getNames(language)
        setCountryOptions(Object.keys(newOptions).map((code) => {
            return { 
                id: code,
                label: newOptions[code]
            }
        }))
    }, [language,setCountryOptions])

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
                        invalid={errors.firstName ? true : false}
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
                        invalid={errors.lastName ? true : false}
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
                        invalid={errors.email ? true : false}
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
                        invalid={errors.password ? true : false}
                    />
                    {errors.password && errors.password &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="country">{t('country')}</Label>
                    <Typeahead
                        id="country"
                        name="country"
                        selected={country}
                        placeholder={t('countryPlaceholder')}
                        options={countryOptions}
                        onChange={(selected) => setCountry(selected)}
                        isInvalid={errors.country ? true : false}
                    />
                    {errors.country && <Input type="hidden" invalid />}
                    {errors.country && errors.country.type == 'required' &&
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

export default RegisterUser;