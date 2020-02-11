import React from 'react'
import {
    Button,
    Container,
    Spinner
} from 'reactstrap'
import {
    useHistory
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function PlaceDetail({place}) {
    const { t } = useTranslation('place')
    const history = useHistory()

    if (!place) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('placeDetail')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/places/' + place.id + '/edit')}
            >{t('commonForms:edit')}</Button>
        </div>
        <dl>
            <dt>{t('name')}</dt>
            <dd>{place.name}</dd>
            <dt>{t('location')}</dt>
            <dd>{place.location ? `${place.location.coordinates[0]},${place.location.coordinates[1]}` : ''}</dd>
            <dt>{t('isOrigin')}</dt>
            <dd>{place.isOrigin ? t('commonForms:yes') : t('commonForms:no')}</dd>
            <dt>{t('isDestination')}</dt>
            <dd>{place.isDestination ? t('commonForms:yes') : t('commonForms:no')}</dd>
            <dt>{t('parkingCapacity')}</dt>
            <dd>{place.parkingCapacity}</dd>
            <dt>{t('timezone')}</dt>
            <dd>{place.timezone}</dd>
        </dl>
    </Container>
}
