import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export default function useGeoPosition() {
    const position = useSelector(state => state.geo.position)
    const distanceUOM = useSelector(state => state.auth.user.distanceUnitOfMeasure)
    const latitude = useSelector(state => state.geo.position ? state.geo.position.coords.latitude : null)
    const longitude = useSelector(state => state.geo.position ? state.geo.position.coords.longitude : null)
    const location = useMemo(() => {
        return latitude && longitude ? `${latitude},${longitude}` : null
    },[latitude,longitude])

    return {
        distanceUOM,
        latitude,
        location,
        longitude,
        position
    }
}