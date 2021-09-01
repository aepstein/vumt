import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useGeoPosition from '../../hooks/useGeoPosition'
import { Highlighter } from 'react-bootstrap-typeahead'
import axios from 'axios'
import distanceUsOM from '../../lib/distanceUnitsOfMeasure'
import PlacesSelect from './PlacesSelect'

export default function DestinationsSelect({name,label,startOn,origin,setOrigin,errors}) {
    const { t } = useTranslation(['visit','translation','uom'])
    const { distanceUOM, latitude, longitude } = useGeoPosition()
    const onSearch = useCallback( async (query) => {
        const params = {type: 'origins'}
        if (latitude && longitude) params.location = `${latitude},${longitude}`
        if (startOn) params.startOn = startOn.toISOString()
        if (query) params.q = query
        try {
            const res = await axios.get('/api/places',{params})
            return res.data.data
        }
        catch (err) {
            throw err
        }
    },[latitude,longitude,startOn])
    const render = useCallback((option, props) => {
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
    return <PlacesSelect
        label={label}
        multiple={false}
        name={name}
        onSearch={onSearch}
        placeholder={t('originPlaceholder')}
        places={origin}
        render={render}
        errors={errors}
        setPlaces={setOrigin}
    />
} 