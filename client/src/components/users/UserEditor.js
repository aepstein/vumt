import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    CustomInput,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import {
    Typeahead
} from 'react-bootstrap-typeahead'
import ApplicableAdvisories from '../../containers/advisories/ApplicableAdvisories'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'
import countries, { postalCodeRequired } from '../../lib/countries'
import provinces from 'provinces'
import postalCodes from 'postal-codes-js'
import phoneValidator from 'phone'
import distanceUnitsOfMeasure from '../../lib/distanceUnitsOfMeasure'
import MembershipsEditor from './MembershipsEditor'
import RolesSelect from '../roles/RolesSelect'

export default function UserEditor({action,user,onSave,saving}) {
    const authUser = useSelector(state => state.auth.user)

    const { t, i18n } = useTranslation(['translation','uom','user'])
    const history = useHistory()

    const [ firstName, setFirstName ] = useState('')
    useEffect(() => {
        setFirstName(user.firstName)
    },[user.firstName,setFirstName])
    const [ lastName, setLastName ] = useState('')
    useEffect(() => {
        setLastName(user.lastName)
    },[user.lastName,setLastName])
    const [ email, setEmail ] = useState('')
    useEffect(() => {
        setEmail(user.email)
    },[user.email,setEmail])
    const [ password, setPassword ] = useState('')
    useEffect(() => {
        setPassword(user.password)
    },[user.password,setPassword])
    const [ country, setCountry ] = useState([])
    const [ countryOptions, setCountryOptions ] = useState([])
    useEffect(() => {
        const language = i18n.language ? i18n.language.substring(0,2) : 'en'
        const newOptions = countries.getNames(language)
        setCountryOptions(Object.keys(newOptions).map((code) => {
            return { 
                id: code,
                label: newOptions[code]
            }
        }))
    }, [i18n.language,setCountryOptions])
    useEffect(() => {
        if (user.country) setCountry(countryOptions.filter(o => o.id === user.country))
    },[user.country,countryOptions,setCountry])
    const [ province, setProvince ] = useState([])
    const [ provinceOptions, setProvinceOptions ] = useState([])
    useEffect(() => {
        const newOptions = country.length > 0 ? provinces.filter((p) => p.country === country[0].id) : []
        setProvinceOptions(newOptions.map((p) => {
            return {
                id: p.name,
                label: p.name
            }
        }))
    },[country,setProvinceOptions])
    useEffect(() => {
        if (user.province) setProvince(provinceOptions.filter(o => o.id === user.province))
    },[user.province,setProvince,provinceOptions])
    const [ postalCode, setPostalCode ] = useState('')
    useEffect(() => {
        setPostalCode(user.postalCode)
    },[user.postalCode,setPostalCode])
    const [ phone, setPhone ] = useState('')
    useEffect(() => {
        setPhone(user.phone)
    },[user.phone,setPhone])
    const [ enableGeolocation, setEnableGeolocation ] = useState(true)
    useEffect(() => {
        setEnableGeolocation(user.enableGeolocation)
    },[user.enableGeolocation, setEnableGeolocation])
    const [ distanceUnitOfMeasure, setDistanceUnitOfMeasure ] = useState('mi')
    useEffect(() => {
        setDistanceUnitOfMeasure(user.distanceUnitOfMeasure)
    },[setDistanceUnitOfMeasure,user.distanceUnitOfMeasure])

    const [ roles, setRoles ] = useState([])
    useEffect(() => {
        setRoles(user.roles)
    },[user.roles,setRoles])

    const [ memberships, setMemberships ] = useState([])
    useEffect(() => {
        setMemberships(user.memberships.map((membership) => {
            return {
                organization: [{id: membership.organization._id, label: membership.organization.name}],
                roles: membership.roles
            }
        }))
    },[user.memberships,setMemberships])
    const onAddMembership = () => {
        setMemberships(memberships.concat({organization: [], roles: []}))
    }

    const [ saveButtonText, setSaveButtonText ] = useState('')
    useEffect(() => {
        switch(action) {
            case 'edit':
                setSaveButtonText(t('user:updateUser'))
                break
            case 'new':
                setSaveButtonText(t('user:addUser'))
                break
            default:
                setSaveButtonText(t('translation:register'))
        }
    },[action,setSaveButtonText,t])

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        if (country.length === 0) {
            setError("country",{type: "required", message: t('invalidRequired')})
            return
        }
        if (provinceOptions.length > 0 && province.length === 0) {
            setError("province",{type: "required", message: t('invalidRequired')})
            return
        }
        if (phone && phoneValidator(phone,'',true).length === 0) {
            setError("phone",{type: "format", message: t('mustBePhone')})
        }
        const newUser = {
            _id: user._id,
            firstName,
            lastName,
            distanceUnitOfMeasure,
            email,
            enableGeolocation,
            password,
            country: country[0].id,
            province: province[0] ? province[0].id : '',
            postalCode,
            phone
        }
        if ( authUser && authUser.roles.includes('admin') ) {
            newUser.memberships = memberships.map((membership) => {
                const {organization,roles} = membership
                return {
                    organization: organization[0] ? organization[0].id : null,
                    roles
                }
            })
            newUser.roles = roles
        }
        onSave(newUser)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h2>{action ? t(`user:${action}User`) : t('translation:register')}</h2>
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
                        value={firstName}
                        onChange={onChange(setFirstName)}
                        invalid={errors.firstName ? true : false}
                    />
                    {errors.firstName && errors.firstName.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">{t('lastName')}</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t('lastName')}
                        innerRef={register({required: true})}
                        value={lastName}
                        onChange={onChange(setLastName)}
                        invalid={errors.lastName ? true : false}
                    />
                    {errors.lastName && errors.lastName.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="email">{t('email')}</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        innerRef={register({required: true})}
                        onChange={onChange(setEmail)}
                        invalid={errors.email ? true : false}
                    />
                    {errors.email && errors.email.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    {errors.email && errors.email.type === 'duplicateKey' &&
                        <FormFeedback>{errors.email.message}</FormFeedback>}
                </FormGroup>
                { (action === 'edit') ? null : <FormGroup>
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
                    {errors.password && errors.password.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup> }
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
                        clearButton={true}
                    />
                    {errors.country && <Input type="hidden" invalid />}
                    {errors.country && errors.country.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                { (provinceOptions.length > 0) ?
                    <FormGroup>
                        <Label for="province">{t('province')}</Label>
                        <Typeahead
                            id="province"
                            name="province"
                            selected={province}
                            placeholder={t('provincePlaceholder')}
                            options={provinceOptions}
                            onChange={(selected) => setProvince(selected)}
                            isInvalid={errors.province ? true : false}
                            clearButton={true}
                        />
                        {errors.province && <Input type="hidden" invalid />}
                        {errors.province && errors.province.type === 'required' &&
                            <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    </FormGroup>
                : '' }
                { country[0] ?
                    <FormGroup>
                        <Label for="postalCode">{t('postalCode')}</Label>
                        <Input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={postalCode}
                            placeholder={t('postalCode')}
                            innerRef={register({
                                required: postalCodeRequired.includes(country[0].id),
                                validate: ((postalCode) => {
                                    if (!postalCode) return true
                                    return postalCodes.validate(country[0].id,postalCode) === true
                                })
                            })}
                            onChange={onChange(setPostalCode)}
                            invalid={errors.postalCode ? true : false}
                        />
                        {errors.postalCode && errors.postalCode.type === 'required' &&
                            <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                        {errors.postalCode && errors.postalCode.type === 'validate' &&
                            <FormFeedback>{t('translation:postalCodeInvalid',{country: country[0].label})}</FormFeedback>}
                    </FormGroup>
                    : '' }
                <FormGroup>
                    <Label for="phone">{t('phone')}</Label>
                    <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder={t('phone')}
                        value={phone}
                        onChange={onChange(setPhone)}
                        invalid={errors.phone ? true : false}
                    />
                    {errors.phone &&
                        <FormFeedback>{t('translation:mustBePhone')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label>{t('user:distanceUnitOfMeasure')}</Label>
                    {Object.keys(distanceUnitsOfMeasure).map((uom,index) => {
                        return <CustomInput
                            type="radio"
                            id={`distanceUnitOfMeasure${uom}`}
                            key={`distanceUnitOfMeasure${index}`}
                            name={`distanceUnitOfMeasure`}
                            label={t(`uom:${uom}`)}
                            checked={distanceUnitOfMeasure === uom}
                            onChange={() => setDistanceUnitOfMeasure(uom)}
                        />
                    })}
                </FormGroup>
                <FormGroup>
                    <CustomInput
                        type="switch"
                        id="enableGeolocation"
                        name="enableGeolocation"
                        label={t('user:enableGeolocation')}
                        checked={enableGeolocation}
                        onChange={onChange(setEnableGeolocation)}
                    />
                </FormGroup>
                { !authUser || !authUser.roles.includes('admin') ? '' : <RolesSelect roles={roles} setRoles={setRoles} /> }
                { !authUser || !authUser.roles.includes('admin') ? '' :
                    <MembershipsEditor memberships={memberships} errors={errors}
                        setMemberships={setMemberships} onAddMembership={onAddMembership} />}
                { !authUser ? <ApplicableAdvisories context="register"/> : '' }
                <p>
                </p>
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{saveButtonText}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
