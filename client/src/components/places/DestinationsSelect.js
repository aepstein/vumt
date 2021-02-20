import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useGeoPosition from '../../hooks/useGeoPosition'
import { Highlighter } from 'react-bootstrap-typeahead'
import axios from 'axios'
import distanceUsOM from '../../lib/distanceUnitsOfMeasure'
import PlacesSelect from './PlacesSelect'

export default function DestinationsSelect({name,label,origin,destinations,setDestinations,errors}) {
    const { t } = useTranslation(['visit','translation','uom'])
    const { distanceUOM } = useGeoPosition()
    const onSearch = useCallback(async (query) => {
        const params = {type: 'destinations'}
        if (origin && origin.location) {
            params.location = `${origin.location.coordinates[1]},${origin.location.coordinates[0]}`
        }
        if (query) {
            params.q = query
        }
        const res = await axios.get('/api/places',{params})
        return res.data.data
    },[origin])
    const render = useCallback((option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>,
            option.distance && origin ? <div key="distance">
                {t(
                    'translation:distanceFromPlace',
                    {
                        distance: t(
                            `uom:${distanceUOM}WithCount`,
                            {count: Math.round(option.distance/distanceUsOM[distanceUOM].m)}
                        ),
                        place: origin ? origin.label : t('origin')
                    }
                )}
            </div> : ''
        ]
    },[origin,t,distanceUOM])
    return <PlacesSelect
        label={label}
        multiple={true}
        name={name}
        onSearch={onSearch}
        placeholder={t('destinationsPlaceholder')}
        places={destinations}
        render={render}
        setPlaces={setDestinations}
        errors={errors}
    />
} 