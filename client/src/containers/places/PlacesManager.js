import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getPlaces, savePlace } from '../../actions/placeActions';
import { Spinner } from 'reactstrap'
import PlacesList from '../../components/places/PlacesList'
import PlaceDetail from '../../components/places/PlaceDetail'
import PlaceEditor from '../../components/places/PlaceEditor'

const BLANK_PLACE = {
    name: '',
    location: '',
    isOrigin: false,
    isDestination: false,
    parkingCapacity: '',
    timezone: ''
}

export default function PlacesManager({action}) {
    const { defaultAction, placeId } = useParams()
    const places = useSelector(state => state.place.places, shallowEqual)
    const loading = useSelector(state => state.place.placesLoading)
    const loaded = useSelector(state => state.place.placesLoaded)
    const saving = useSelector(state => state.place.placeSaving)

    const [place,setPlace] = useState(BLANK_PLACE)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onSave = (newProps) => {
        if (saving) return
        dispatch(savePlace(newProps,history))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getPlaces())
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (place && place._id === placeId) return
        if (placeId && loaded) {
            const loadedPlace = places.filter(v => v._id === placeId)[0]
            // TODO -- how to handle a place that does not match loaded places?
            if (!loadedPlace) return
            setPlace(loadedPlace)
        }
        else {
            setPlace(BLANK_PLACE)
        }
    },[place,placeId,loaded,places])

    if (loading) return <Spinner color="secondary" />

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <PlaceEditor place={place} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <PlaceDetail place={place} />
        default:
            return <PlacesList places={places} />
    }
}
