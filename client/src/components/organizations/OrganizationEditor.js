import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'
import DistrictsSelect from '../districts/DistrictsSelect'

export default function OrganizationEditor({organization,onSave,saving}) {
    const { t } = useTranslation(['organization','translation'])
    const history = useHistory()

    const [ name, setName ] = useState(organization.name)
    useEffect(() => {
        setName(organization.name)
    },[organization.name,setName])
    const [ districts, setDistricts ] = useState(organization.districts)
    useEffect(() => {
        setDistricts(organization.districts)
    },[organization.districts,setDistricts])


    const { register, handleSubmit, setError, clearErrors, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        clearErrors()
        const newOrganization = {
            _id: organization._id,
            name,
            districts: districts.map(({_id}) => { return _id })
        }
        onSave(newOrganization)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h1>{organization._id ? t('editOrganization') : t('newOrganization')}</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="name">{t('name')}</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={t('name')}
                        innerRef={register({required: true})}
                        value={name}
                        onChange={onChange(setName)}
                        invalid={errors.name ? true : false}
                    />
                    {errors.name && errors.name.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <DistrictsSelect districts={districts} setDistricts={setDistricts} />
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{organization._id ? t('updateOrganization') : t('addOrganization')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('translation:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
