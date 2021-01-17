import React, { useRef, useEffect } from 'react'
import {
    Button,
    Container,
    Spinner
} from 'reactstrap'
import L from 'leaflet'
import { Map, TileLayer } from 'react-leaflet'
import {
    useHistory
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function DistrictDetail({district}) {
    const { t } = useTranslation(['district','translation'])
    const history = useHistory()

    const mapRef = useRef()

    useEffect(() => {
        if (!district.boundaries) { return }
        const geoJSON = new L.GeoJSON(district.boundaries)
        geoJSON.eachLayer( (layer) => {
            layer.addTo(mapRef.current.leafletElement)
            mapRef.current.leafletElement.fitBounds(layer.getBounds())
        })
    },[district.boundaries])

    if (!district._id) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('districtDetail')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/districts/' + district.id + '/edit')}
            >{t('translation:edit')}</Button>
        </div>
        <dl>
            <dt>{t('name')}</dt>
            <dd>{district.name}</dd>
        </dl>
        <dl>
            <dt>{t('boundaries')}</dt>
            <dd>
                <Map id="mapid" ref={mapRef} zoomControl={true}>
                    <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                </Map>
            </dd>
        </dl>
    </Container>
}
