import React, { useState, useEffect } from 'react'
import useToken from '../../hooks/useToken'
import axios from 'axios'
import useGeoPosition from '../../hooks/useGeoPosition'
import NewVisitMenu from '../../components/visits/NewVisitMenu'

export default function NewVisitPlanner({origin,setOrigin,startOn,setStartOn,setAutoCheckIn}) {
    const tokenConfig = useToken()
    const { location } = useGeoPosition()
    const [nearestOrigin, setNearestOrigin] = useState()
    const [nearestOriginLoaded, setNearestOriginLoaded] = useState(false)
    const [nearestOriginLoading, setNearestOriginLoading] = useState(false)
    const [loadedLocation, setLoadedLocation] = useState(null)
    
    useEffect(() => {
        if ( nearestOriginLoading || (location && location === loadedLocation) ) return
        if ( !location ) {
            setNearestOrigin(null)
            setNearestOriginLoaded(true)
            return
        }
        setNearestOriginLoading(true)
        const config = {
            ...tokenConfig,
            params: {
                location,
                type: 'origins'
            }
        }
        axios
            .get('/api/places',config)
            .then(res => {
                if ( res.data.data.length > 0 ) {
                    setNearestOrigin(res.data.data[0])
                }
                else {
                    setNearestOrigin(null)
                }
                setLoadedLocation(location)
                setNearestOriginLoaded(true)
                setNearestOriginLoading(false)
            })
    },
    [nearestOriginLoaded,nearestOriginLoading,location,loadedLocation,tokenConfig,setNearestOrigin,
        setNearestOriginLoaded,setNearestOriginLoading,setLoadedLocation]
    )

    return <NewVisitMenu
        nearestOrigin={nearestOrigin}
        location={location}
        nearestOriginLoaded={nearestOriginLoaded}
        nearestOriginLoading={nearestOriginLoading}
        origin={origin}
        setOrigin={setOrigin}
        startOn={startOn}
        setStartOn={setStartOn}
        setAutoCheckIn={setAutoCheckIn}
    />
}