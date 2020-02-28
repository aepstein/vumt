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
} from 'reactstrap';
import {
    Typeahead
} from 'react-bootstrap-typeahead'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { mustBeAtLeast, mustBeWholeNumber } from '../../lib/validators'
import timezones from '../../lib/timezones.json'

export default function PlaceEditor({action,place,onSave,saving}) {
    const { t } = useTranslation('place')
    const history = useHistory()

    const [ name, setName ] = useState('')
    useEffect(() => {
        setName(place.name)
    },[place.name,setName])
    const [ latitude, setLatitude ] = useState('')
    const [ longitude, setLongitude ] = useState('')
    useEffect(() => {
        if (place.location && place.location.coordinates) {
            setLongitude(place.location.coordinates[0])
            setLatitude(place.location.coordinates[1])
        }
    },[place.location,setLatitude,setLongitude])
    const [ isOrigin, setIsOrigin ] = useState(false)
    useEffect(() => {
        setIsOrigin(place.isOrigin)
    },[place.isOrigin,setIsOrigin])
    const [ isDestination, setIsDestination ] = useState(false)
    useEffect(() => {
        setIsDestination(place.isDestination)
    },[place.isDestination,setIsDestination])
    const [ parkingCapacity, setParkingCapacity ] = useState('')
    useEffect(() => {
        setParkingCapacity(place.parkingCapacity)
    },[place.parkingCapacity,setParkingCapacity])
    const [ timezone, setTimezone ] = useState([])
    useEffect(() => {
        if (place.timezone) setTimezone([place.timezone])
    },[place.timezone,setTimezone])

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        if (timezone.length === 0) {
            setError("timezone","required",t('invalidRequired'))
            return
        }
        const newPlace = {
            _id: place._id,
            name,
            location: {
                type: 'Point',
                coordinates: [longitude,latitude]
            },
            isOrigin,
            isDestination,
            parkingCapacity,
            timezone: timezone[0]
        }
        onSave(newPlace)
    }

    return <div>
        <Container>
            <h1>{place._id ? t('editPlace') : t('newPlace')}</h1>
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
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="latitude">{t('latitude')}</Label>
                    <Input
                        type="number"
                        name="latitude"
                        id="latitude"
                        placeholder={t('latitude')}
                        innerRef={register({required: true, min: 0, max: 90, validate: {
                            min: mustBeAtLeast(0)
                        }})}
                        value={latitude}
                        onChange={onChange(setLatitude)}
                        invalid={errors.latitude ? true : false}
                    />
                    {errors.latitude && errors.latitude.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.latitude && errors.latitude.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.latitude && errors.latitude.type === 'max' &&
                        <FormFeedback>{t('commonForms:mustBeAtMost',{max: 90})}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="longitude">{t('longitude')}</Label>
                    <Input
                        type="number"
                        name="longitude"
                        id="longitude"
                        placeholder={t('longitude')}
                        innerRef={register({required: true, min: -180, max: 180})}
                        value={longitude}
                        onChange={onChange(setLongitude)}
                        invalid={errors.longitude ? true : false}
                    />
                    {errors.longitude && errors.longitude.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.longitude && errors.longitude.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: -180})}</FormFeedback>}
                    {errors.longitude && errors.longitude.type === 'max' &&
                        <FormFeedback>{t('commonForms:mustBeAtMost',{max: 180})}</FormFeedback>}
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            name="isOrigin"
                            id="isOrigin"
                            checked={isOrigin}
                            onChange={onChange(setIsOrigin)}
                        /> {t('isOrigin')}
                    </Label>
                </FormGroup>
                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            name="isDestination"
                            id="isDestination"
                            checked={isDestination}
                            onChange={onChange(setIsDestination)}
                        /> {t('isDestination')}
                    </Label>
                </FormGroup>
                <FormGroup>
                    <Label for="parkingCapacity">{t('parkingCapacity')}</Label>
                    <Input
                        type="number"
                        name="parkingCapacity"
                        id="parkingCapacity"
                        placeholder={t('parkingCapacity')}
                        innerRef={register({required: true, min: 0, validate: {
                            min: mustBeAtLeast(0),
                            mustBeWholeNumber
                        }})}
                        value={parkingCapacity}
                        onChange={onChange(setParkingCapacity)}
                        invalid={errors.parkingCapacity ? true : false}
                    />
                    {errors.parkingCapacity && errors.parkingCapacity.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    {errors.parkingCapacity && errors.parkingCapacity.type === 'min' &&
                        <FormFeedback>{t('commonForms:mustBeAtLeast',{min: 0})}</FormFeedback>}
                    {errors.parkingCapacity && errors.parkingCapacity.type === 'mustBeWholeNumber' &&
                        <FormFeedback>{t('commonForms:mustBeWholeNumber')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="timezone">{t('timezone')}</Label>
                    <Typeahead
                        id="timezone"
                        name="timezone"
                        selected={timezone}
                        placeholder={t('timezonePlaceholder')}
                        options={timezones}
                        onChange={(selected) => setTimezone(selected)}
                        isInvalid={errors.timezone ? true : false}
                        clearButton={true}
                    />
                    {errors.timezone && <Input type="hidden" invalid />}
                    {errors.timezone && errors.timezone.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{place._id ? t('updatePlace') : t('addPlace')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('commonForms:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
