import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import {
    AsyncTypeahead
} from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import axios from 'axios'
import { addVisit } from '../actions/visitActions';

function NewVisit() {
    const error = useSelector( state => state.error )
    const visitSaving = useSelector( state => state.visit.visitSaving )

    const [ name, setName ] = useState('')
    const [ origin, setOrigin ] = useState('')
    const [ originOptions, setOriginOptions ] = useState([])
    const [ originLoading, setOriginLoading ] = useState(false)
    const originSearch = (query) => {
        setOriginLoading(true)
        axios
            .get('/api/places/origins')
            .then((res) => {
                setOriginLoading(false)
                setOriginOptions(res.data.map((place) => {
                    return {id: place._id, label: place.name}
                }))
            })
    }
    const [ isSaving, setIsSaving ] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    const { t } = useTranslation('visit')

    const { register, handleSubmit, watch, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        const newVisit = {
            name,
            originPlaceId: origin && origin[0] ? origin[0].id : ''
        }
        setIsSaving(true)
        dispatch(addVisit(newVisit))
    }

    useEffect(() => {
        if (isSaving && !visitSaving && !error.id) {
            setIsSaving(true)
            history.push("/")
        }
    })

    return <div>
        <Container>
            <h2>{t('addVisit')}</h2>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="name">{t('visit')}</Label>
                    <Input
                        type="text"
                        name="name"
                        id="visit"
                        placeholder={t('visitPlaceholder')}
                        innerRef={register({required: true})}
                        onChange={onChange(setName)}
                        invalid={errors.name}
                    />
                    {errors.name && errors.name && <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="origin">{t('origin')}</Label>
                    <AsyncTypeahead 
                        id="origin"
                        name="origin"
                        selected={origin}
                        placeholder={t('originPlaceholder')}
                        options={originOptions}
                        isLoading={originLoading}
                        onSearch={originSearch}
                        onChange={(selected) => setOrigin(selected)}
                        inputRef={register}
                    />
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >{t('addVisit')}</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
}

NewVisit.propTypes = {
    isAuthenticated: PropTypes.bool
}

export default NewVisit;