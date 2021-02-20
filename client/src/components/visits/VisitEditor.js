import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useTimezone from '../../hooks/useTimezone'
import useZonedDateTime from '../../hooks/useZonedDateTime'
import { mustBeWholeNumber, mustBeAtLeast } from '../../lib/validators'
import OriginSelect from '../places/OriginSelect'
import DestinationsSelect from '../places/DestinationsSelect'
import ApplicableAdvisories from '../../containers/advisories/ApplicableAdvisories'

export default function VisitEditor({visit,onSave,saving}) {
    const { t } = useTranslation(['visit','place','translation','uom','error'])

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
    const [ origin, setOrigin ] = useState(visit.origin)
    useEffect(() => {
        if (!origin || !origin.timezone) return
        setTimezone(origin.timezone)
    },[origin,setTimezone])
    const [ destinations, setDestinations ] = useState(visit.destinations)
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
    const [places, setPlaces] = useState([])
    useEffect(() => {
        const origins = origin ? [origin._id] : []
        setPlaces(origins.concat(destinations.map(d => d._id)))
    },[origin,destinations,setPlaces])

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (saving) return
        if (!origin) {
            setError("origin",{type: "required", message: t('translation:invalidRequired')})
            return
        }
        const newVisit = {
            _id: visit._id,
            startOn,
            origin: (origin ? origin._id : ''),
            destinations: destinations.map((d) => d._id),
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
                <OriginSelect
                    errors={errors.origin}
                    origin={origin}
                    label={t('origin')}
                    name="origin"
                    setOrigin={setOrigin}
                    startOn={startOn}
                />
                <DestinationsSelect
                    destinations={destinations}
                    label={t('destinations')}
                    name="destinations"
                    origin={origin}
                    startOn={startOn}
                    setDestinations={setDestinations}
                />
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
