import React, { useState } from 'react';
import {
    Button,
    ButtonGroup,
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
import { useTranslation } from 'react-i18next'
import axios from 'axios'

export default function VisitEditor({visit,onSave,saving}) {
    const [ startOn, setStartOn ] = useState('')
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
    const [ destinations, setDestinations ] = useState([])
    const [ destinationOptions, setDestinationOptions ] = useState([])
    const [ destinationLoading, setDestinationLoading ] = useState(false)
    const [ groupSize, setGroupSize ] = useState('')
    const destinationSearch = (query) => {
        setDestinationLoading(true)
        axios
            .get('/api/places/destinations')
            .then((res) => {
                setDestinationLoading(false)
                setDestinationOptions(res.data.map((place) => {
                    return {id: place._id, label: place.name}
                }))
            })
    }

    const { t } = useTranslation('visit')

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (saving) return
        if (origin.length === 0) {
            setError("origin","required",t('invalidRequired'))
            return
        }
        const newVisit = {
            startOn,
            origin: (origin && origin[0] ? origin[0].id : ''),
            destinations: destinations.map((d) => {
                return {
                    "_id": d.id
                }
            }),
            groupSize
        }
        onSave(newVisit)
    }

    return <div>
        <Container>
            <h2>{t('addVisit')}</h2>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="startOn">{t('startOn')}</Label>
                    <Input
                        id="startOn"
                        name="startOn"
                        value={startOn}
                        onChange={onChange(setStartOn)}
                        innerRef={register({required: true})}
                        invalid={errors.startOn ? true : false}
                    />
                    {errors.startOn && errors.startOn.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
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
                        isInvalid={errors.origin}
                    />
                    {errors.origin && <Input type="hidden" invalid />}
                    {errors.origin && errors.origin.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="destinations">{t('destinations')}</Label>
                    <AsyncTypeahead 
                        id="destinations"
                        name="destinations"
                        multiple
                        selected={destinations}
                        placeholder={t('destinationsPlaceholder')}
                        options={destinationOptions}
                        isLoading={destinationLoading}
                        onSearch={destinationSearch}
                        onChange={(selected) => setDestinations(selected)}
                        inputRef={register}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="groupSize">{t('groupSize')}</Label>
                    <Input
                        type="number"
                        id="groupSize"
                        name="groupSize"
                        value={groupSize}
                        onChange={onChange(setGroupSize)}
                        innerRef={register({required: true, min: 1, validate: (groupSize) => {
                            if (!groupSize || !Number(groupSize)) return true
                            return Number.isInteger(Number(groupSize))
                        }})}
                        invalid={errors.groupSize ? true : false}
                    />
                    {console.log(errors)}
                    {errors.groupSize && errors.groupSize.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 1})}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'validate' &&
                        <FormFeedback>{t('commonForms:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >{t('addVisit')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
