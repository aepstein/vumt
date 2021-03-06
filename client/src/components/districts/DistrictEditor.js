import './DistrictEditor.css'
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
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'

export default function DistrictEditor({district,onSave,saving}) {
    const { t } = useTranslation(['district','translation'])
    const history = useHistory()

    const [ name, setName ] = useState('')
    useEffect(() => {
        setName(district.name)
    },[district.name,setName])

    const mapRef = useRef()
    const [ boundaries, setBoundaries ] = useState('')
    const [ boundariesSaving, setBoundariesSaving ] = useState(false)
    const boundariesFeatureGroup = useRef()
    // Save edited feature to boundaries
    const leafletToBoundaries = () => {
        if (boundariesSaving) { return }
        setBoundariesSaving(true)
        const geoJSON = boundariesFeatureGroup.current.leafletElement.toGeoJSON()
        if (geoJSON.features.length > 0) {
            setBoundaries({
                type: 'MultiPolygon',
                coordinates: geoJSON.features.map((feature) => feature.geometry.coordinates)
            })
        }
        else {
            setBoundaries('')
        }
        setBoundariesSaving(false)
    }
    // Update editable feature group when boundaries property is updated
    useEffect(() => {
        if (boundariesSaving || !boundaries || !boundariesFeatureGroup.current) { return }
        const polygons = boundaries.type !== 'MultiPolygon' ? boundaries : 
            boundaries.coordinates.map((coordinates) => { 
                return {type: 'Polygon', coordinates}
            })
        const geoJSON = new L.GeoJSON(polygons)
        const fg = boundariesFeatureGroup.current.leafletElement
        geoJSON.eachLayer( (layer) => {
            fg.addLayer(layer)
        })
        mapRef.current.leafletElement.fitBounds(fg.getBounds())
    },[boundariesSaving,boundaries])
    useEffect(() => {
        setBoundaries(district.boundaries)
    },[district.boundaries,setBoundaries])

    const { register, handleSubmit, setError, clearErrors, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        clearErrors()
        if (!boundaries) {
            setError('boundaries',{type: 'required', message: t('translation:invalidRequired')})
            return
        }
        const newDistrict = {
            _id: district._id,
            name,
            boundaries
        }
        onSave(newDistrict)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h1>{district._id ? t('editDistrict') : t('newDistrict')}</h1>
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
                <FormGroup>
                    <Label for="boundaries">{t('boundaries')}</Label>
                    <Input
                        type="hidden"
                        name="boundaries"
                        id="boundaries"
                        innerRef={register({})}
                        invalid={errors.boundaries ? true : false}
                    />
                    <Map id="mapid" ref={mapRef} center={[44.109502,-73.924730]} zoom={13} zoomControl={true}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        />
                        <FeatureGroup ref={boundariesFeatureGroup}>
                            <EditControl
                            position='topright'
                            onCreated={leafletToBoundaries}
                            onEdited={leafletToBoundaries}
                            onDeleted={leafletToBoundaries}
                            draw={{
                                rectangle: false,
                                polyline: false,
                                circle: false,
                                marker: false,
                                circlemarker: false
                            }}
                            />
                        </FeatureGroup>
                    </Map>
                    {errors.boundaries && errors.boundaries.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{district._id ? t('updateDistrict') : t('addDistrict')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('translation:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
