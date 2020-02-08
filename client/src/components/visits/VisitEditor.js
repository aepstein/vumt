import React, { useState, useEffect, useRef } from 'react';
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
import { mustBeWholeNumber, mustBeAtLeast } from '../../lib/validators'
import tz from 'timezone/loaded'

export default function VisitEditor({visit,onSave,saving}) {
    const { t } = useTranslation('visit')

    const [ timezone, setTimezone ] = useState('')
    useEffect(() => {
        if (!visit.origin || !visit.origin.timezone) return setTimezone('')
        setTimezone(visit.origin.timezone)
    },[visit.origin])
    const [ startOn, setStartOn ] = useState('')
    useEffect(() => {
        setStartOn(visit.startOn)
    },[visit.startOn,setStartOn])
    const [ startOnDate, setStartOnDate ] = useState('')
    useEffect(() => {
        if (!visit.startOn || !timezone) return
        setStartOnDate(tz(visit.startOn,timezone,'%Y-%m-%d'))
    },[visit.startOn,setStartOnDate,timezone])
    const [ startOnTime, setStartOnTime ] = useState('')
    useEffect(() => {
        if (!visit.startOn || !timezone) return
        setStartOnTime(tz(visit.startOn,timezone,'%H:%M'))
    },[visit.startOn,setStartOnTime,timezone])
    useEffect(() => {
        if (startOnDate && startOnTime) {
            setStartOn(new Date(tz(`${startOnDate} ${startOnTime}`,timezone)))
        }
        else {
            setStartOn('')
        }
    },[startOnDate,startOnTime,setStartOn,timezone])
    const [ origin, setOrigin ] = useState([])
    useEffect(() => {
        const vOrigin = visit.origin._id ?
            [{id: visit.origin._id, label: visit.origin.name, timezone: visit.origin.timezone}] : []
        setOriginOptions(vOrigin)
        setOrigin(vOrigin)
    },[visit.origin])
    const originRef = useRef()
    const [ originOptions, setOriginOptions ] = useState([])
    const [ originLoading, setOriginLoading ] = useState(false)
    const originSearch = (query) => {
        setOriginLoading(true)
        axios
            .get('/api/places/origins')
            .then((res) => {
                setOriginLoading(false)
                setOriginOptions(res.data.map((place) => {
                    return {id: place._id, label: place.name, timezone: place.timezone}
                }))
            })
    }
    useEffect(() => {
        if (origin.length === 0 || !origin[0].timezone) return
        setTimezone(origin[0].timezone)
    },[origin,setTimezone])
    const [ destinations, setDestinations ] = useState([])
    useEffect(() => {
        const vDestinations = visit.destinations.map((d) => {
            return {id: d._id, label: d.name}
        })
        setDestinationOptions(vDestinations)
        setDestinations(vDestinations)
    },[visit.destinations])
    const destinationsRef = useRef()
    const [ destinationOptions, setDestinationOptions ] = useState([])
    const [ destinationLoading, setDestinationLoading ] = useState(false)
    const [ durationNights, setDurationNights ] = useState('')
    useEffect(() => {
        setDurationNights(visit.durationNights)
    },[visit.durationNights])
    const [ groupSize, setGroupSize ] = useState('')
    useEffect(() => {
        setGroupSize(visit.groupSize)
    },[visit.groupSize])
    const [ parkedVehicles, setParkedVehicles ] = useState('')
    useEffect(() => {
        setParkedVehicles(visit.parkedVehicles)
    },[visit.parkedVehicles])
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
            _id: visit._id,
            startOn,
            origin: (origin && origin[0] ? origin[0].id : ''),
            destinations: destinations.map((d) => {
                return {
                    "_id": d.id
                }
            }),
            durationNights,
            groupSize,
            parkedVehicles
        }
        onSave(newVisit)
    }

    return <div>
        <Container>
            <h2>{visit._id ? t('editVisit') : t('addVisit')}</h2>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="startOnDate">{t('startOnDate')}</Label>
                    <Input
                        id="startOnDate"
                        name="startOnDate"
                        type="date"
                        value={startOnDate}
                        onChange={onChange(setStartOnDate)}
                        innerRef={register({required: true})}
                        invalid={errors.startOnDate ? true : false}
                    />
                    {errors.startOnDate && errors.startOnDate.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="startOnTime">{t('startOnTime')}</Label>
                    <Input
                        id="startOnTime"
                        name="startOnTime"
                        type="time"
                        value={startOnTime}
                        onChange={onChange(setStartOnTime)}
                        innerRef={register({required: true})}
                        invalid={errors.startOnTime ? true : false}
                    />
                    {errors.startOnTime && errors.startOnTime.type === 'required' &&
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
                        ref={originRef}
                        clearButton={true}
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
                        ref={destinationsRef}
                        clearButton={true}
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
                        innerRef={register({required: true, min: 1, validate: {
                            mustBeWholeNumber
                        }})}
                        invalid={errors.groupSize ? true : false}
                    />
                    {errors.groupSize && errors.groupSize.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 1})}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('commonForms:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="parkedVehicles">{t('parkedVehicles')}</Label>
                    <Input
                        type="number"
                        id="parkedVehicles"
                        name="parkedVehicles"
                        value={parkedVehicles}
                        onChange={onChange(setParkedVehicles)}
                        innerRef={register({required: true, min: 0, validate: {
                            min: mustBeAtLeast(0),
                            mustBeWholeNumber
                        }})}
                        invalid={errors.parkedVehicles ? true : false}
                    />
                    {errors.parkedVehicles && errors.parkedVehicles.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.parkedVehicles && errors.parkedVehicles.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.parkedVehicles && errors.parkedVehicles.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('commonForms:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="durationNights">{t('durationNights')}</Label>
                    <Input
                        type="number"
                        id="durationNights"
                        name="durationNights"
                        value={durationNights}
                        onChange={onChange(setDurationNights)}
                        innerRef={register({required: true, min: 0, validate: {
                            min: mustBeAtLeast(0),
                            mustBeWholeNumber
                        }})}
                        invalid={errors.durationNights ? true : false}
                    />
                    {errors.durationNights && errors.durationNights.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.durationNights && errors.durationNights.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.durationNights && errors.durationNights.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('commonForms:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >{visit._id ? t('editVisit') : t('addVisit')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
