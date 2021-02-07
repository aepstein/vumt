import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    AsyncTypeahead,
    Highlighter
} from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import useGeoPosition from '../../hooks/useGeoPosition'
import useTimezone from '../../hooks/useTimezone'
import useZonedDateTime from '../../hooks/useZonedDateTime'
import { mustBeWholeNumber, mustBeAtLeast } from '../../lib/validators'
import distanceUsOM from '../../lib/distanceUnitsOfMeasure'
import ApplicableAdvisories from '../../containers/visits/ApplicableAdvisories'

export default function VisitEditor({visit,onSave,saving}) {
    const { distanceUOM, latitude, longitude, position } = useGeoPosition()
    const { t } = useTranslation(['visit','place','translation','uom'])

    const [ startOn, setStartOn ] = useState('')
    useEffect(() => {
        setStartOn(visit.startOn)
    },[visit.startOn,setStartOn])
    const [ timezone, setTimezone ] = useTimezone()
    const [ startOnDate, setStartOnDate, startOnTime, setStartOnTime
        ] = useZonedDateTime(timezone,visit.startOn,setStartOn)
    useEffect(() => {
        if (!visit.origin || !visit.origin.timezone) return setTimezone('America/New_York')
        setTimezone(visit.origin.timezone)
    },[visit.origin,setTimezone])
    const [ origin, setOrigin ] = useState([])
    const [ originOptions, setOriginOptions ] = useState([])
    useEffect(() => {
        const vOrigin = visit.origin._id ?
            [{id: visit.origin._id, label: visit.origin.name, timezone: visit.origin.timezone,
                location: visit.origin.location}] : []
        setOriginOptions(vOrigin)
        setOrigin(vOrigin)
    },[visit.origin,setOrigin,setOriginOptions])
    const originRef = useRef()
    const [ originLoading, setOriginLoading ] = useState(false)
    const originSearch = useCallback((query) => {
        const params = {type: 'origins'}
        if (latitude && longitude) params['location'] = `${latitude},${longitude}`
        if (startOn) params['startOn'] = startOn.toISOString()
        setOriginLoading(true)
        axios
            .get('/api/places',{params})
            .then((res) => {
                setOriginOptions(res.data.data.map((place) => {
                    return {id: place._id, label: place.name, timezone: place.timezone, location: place.location,
                        distance: place.distance, visits: place.visits, parkingCapacity: place.parkingCapacity}
                }))
                setOriginLoading(false)
            })
    },[latitude,longitude,startOn,setOriginLoading,setOriginOptions])
    const initOriginSearch = useCallback(() => {
        if (!position || originOptions.length > 0) return
        originSearch()
    },[position,originOptions,originSearch])
    useEffect(() => {
        if (origin.length === 0 || !origin[0].timezone) return
        setTimezone(origin[0].timezone)
    },[origin,setTimezone])
    const renderOrigins = useCallback((option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>,
            typeof option.distance !== 'undefined' ? <div key="distance">
                {t(
                    'translation:distanceAway',
                    {
                        distance: t(
                            `uom:${distanceUOM}WithCount`,
                            {count: Math.round(option.distance/distanceUsOM[distanceUOM].m)}
                        )
                    }
                )}
            </div> : '',
            (option.visits && option.visits.length > 0) ? <div key="visits">
                {t('place:partyWithCount',{count: option.visits[0].parties})},&nbsp;
                {t('place:personWithCount',{count: option.visits[0].people})},&nbsp;
                {t('place:parkedVehicleWithCount',{count: option.visits[0].parkedVehicles, capacity: option.parkingCapacity})}
            </div> : ''
        ]
    },[t,distanceUOM])
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
    const destinationSearch = useCallback((query) => {
        setDestinationLoading(true)
        const params = {type: 'destinations'}
        if (origin && origin[0]) {
            params['location'] = `${origin[0].location.coordinates[1]},${origin[0].location.coordinates[0]}`
        }
        axios
            .get('/api/places',{params})
            .then((res) => {
                setDestinationOptions(res.data.data.map((place) => {
                    return {id: place._id, label: place.name, distance: place.distance}
                }))
                setDestinationLoading(false)
            })
    },[setDestinationLoading,setDestinationOptions,origin])
    const initDestinationSearch = useCallback(() => {
        if (!origin || destinationOptions.length > 0) return
        destinationSearch()
    },[origin,destinationOptions,destinationSearch])
    const doSetOrigin = useCallback((selected) => {
        setOrigin(selected)
        if (destinationLoading) return
        setDestinationLoading(true)
        setDestinationOptions([])
        setDestinationLoading(false)
    },[setOrigin,destinationLoading,setDestinationLoading,setDestinationOptions])
    const renderDestinations = useCallback((option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>,
            option.distance && origin[0] ? <div key="distance">
                {t(
                    'translation:distanceFromPlace',
                    {
                        distance: t(
                            `uom:${distanceUOM}WithCount`,
                            {count: Math.round(option.distance/distanceUsOM[distanceUOM].m)}
                        ),
                        place: origin[0] ? origin[0].label : t('origin')
                    }
                )}
            </div> : ''
        ]
    },[origin,t,distanceUOM])
    const [places, setPlaces] = useState([])
    useEffect(() => {
        setPlaces(origin.map(o => o.id).concat(destinations.map(d => d.id)))
    },[origin,destinations,setPlaces])

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (saving) return
        if (origin.length === 0) {
            setError("origin",{type: "required", message: t('invalidRequired')})
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
                <p>{t('translation:timesAreLocal',{timezone})}</p>
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
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
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
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
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
                        delay={200}
                        onSearch={originSearch}
                        onFocus={initOriginSearch}
                        onChange={doSetOrigin}
                        isInvalid={errors.origin}
                        minLength={0}
                        renderMenuItemChildren={renderOrigins}
                        ref={originRef}
                        clearButton={true}
                    />
                    {errors.origin && <Input type="hidden" invalid />}
                    {errors.origin && errors.origin.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
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
                        onFocus={initDestinationSearch}
                        renderMenuItemChildren={renderDestinations}
                        ref={destinationsRef}
                        delay={200}
                        minLength={0}
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
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'min' &&
                        <FormFeedback>{t('translation:mustBeAtLeast',{min: 1})}</FormFeedback>}
                    {errors.groupSize && errors.groupSize.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
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
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    {errors.parkedVehicles && errors.parkedVehicles.type === 'min' &&
                        <FormFeedback>{t('translation:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.parkedVehicles && errors.parkedVehicles.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
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
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    {errors.durationNights && errors.durationNights.type === 'min' &&
                        <FormFeedback>{t('translation:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.durationNights && errors.durationNights.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >{visit._id ? t('editVisit') : t('addVisit')}</Button>
                </ButtonGroup>
            </Form>
            <ApplicableAdvisories context={visit._id ? 'editVisit' : 'newVisit'} startOn={startOn} places={places} />
        </Container>
    </div>
}
