import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function useGeoPosition() {
    const position = useSelector(state => state.geo.position)
    const distanceUOM = useSelector(state => state.auth.user.distanceUnitOfMeasure)

    const [latitude,setLatitude] = useState(null)
    useEffect(() => {
        if (!position) return
        setLatitude(position.coords.latitude)
    },[position,setLatitude])

    const [longitude,setLongitude] = useState(null)
    useEffect(() => {
        if (!position) return
        setLongitude(position.coords.longitude)
    },[position,setLongitude])
    
    return {
        distanceUOM,
        latitude,
        longitude,
        position
    }
}