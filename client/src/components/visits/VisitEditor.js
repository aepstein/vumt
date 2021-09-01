import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import {
    Container,
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import useTimezone from '../../hooks/useTimezone'
import ApplicableAdvisories from '../../containers/advisories/ApplicableAdvisories'
import VisitDepartureEditor from './VisitDepartureEditor'
import VisitDestinationsEditor from './VisitDestinationsEditor'
import NewVisitPlanner from '../../containers/visits/NewVisitPlanner'
import VisitDetailsEditor from './VisitDetailsEditor'

export default function VisitEditor({visit,onSave,saving}) {
    const { path } = useRouteMatch()
    const { t } = useTranslation(['visit','place','translation','uom','error'])

    const [ startOn, setStartOn ] = useState('')
    useEffect(() => {
        setStartOn(visit.startOn)
    },[visit.startOn,setStartOn])
    const [ timezone, setTimezone ] = useTimezone()
    useEffect(() => {
        if (!visit.origin || !visit.origin.timezone) return setTimezone('America/New_York')
        setTimezone(visit.origin.timezone)
    },[visit.origin,setTimezone])
    const [ origin, setOrigin ] = useState(visit.origin)
    useEffect(() => {
        if (!origin || !origin.timezone) return
        setTimezone(origin.timezone)
    },[origin,setTimezone])
    const [ destinations, setDestinations ] = useState(visit.destinations)
    const [ durationNights, setDurationNights ] = useState('')
    useEffect(() => {
        setDurationNights(visit.durationNights)
    },[visit.durationNights])
    const [ groupSize, setGroupSize ] = useState('')
    useEffect(() => {
        setGroupSize(visit.groupSize)
    },[visit.groupSize])
    const [ parkedVehicles, setParkedVehicles ] = useState('')
    useEffect(() => {
        setParkedVehicles(visit.parkedVehicles)
    },[visit.parkedVehicles])
    const [places, setPlaces] = useState([])
    useEffect(() => {
        const origins = origin ? [origin._id] : []
        setPlaces(origins.concat(destinations.map(d => d._id)))
    },[origin,destinations,setPlaces])
    const [autoCheckIn, setAutoCheckIn] = useState(false)

    const onSubmit = (e) => {
        if (saving) return
        const newVisit = {
            _id: visit._id,
            startOn,
            origin: (origin ? origin._id : ''),
            destinations: destinations.map((d) => d._id),
            durationNights,
            groupSize,
            parkedVehicles
        }
        if (autoCheckIn) newVisit.checkedIn = new Date()
        onSave(newVisit)
    }

    return <Container>
        <h2>{visit._id ? t('editVisit') : t('addVisit')}</h2>
        <Switch>
            <Route path={`${path}/departure`}>
                <VisitDepartureEditor
                    origin={origin}
                    setOrigin={setOrigin}
                    startOn={startOn}
                    setStartOn={setStartOn}
                    timezone={timezone}
                />
            </Route>
            <Route path={`${path}/destinations`}>
                <VisitDestinationsEditor
                    origin={origin}
                    startOn={startOn}
                    destinations={destinations} 
                    setDestinations={setDestinations}
                />
            </Route>
            <Route path={`${path}/details`}>
                <VisitDetailsEditor
                    visit={visit}
                    durationNights={durationNights}
                    setDurationNights={setDurationNights}
                    groupSize={groupSize}
                    setGroupSize={setGroupSize}
                    parkedVehicles={parkedVehicles}
                    setParkedVehicles={setParkedVehicles}
                    startOn={startOn}
                    onSubmit={onSubmit}
                />
            </Route>
            <Route exact path={path}>
                { visit._id ? 
                    <Redirect to={{pathname: `/visits/${visit._id}/edit/departure`}}/> : 
                    <NewVisitPlanner
                        visit={visit}
                        origin={origin}
                        setOrigin={setOrigin}
                        setStartOn={setStartOn}
                        setAutoCheckIn={setAutoCheckIn}
                    />
                }
            </Route>
        </Switch>
        <ApplicableAdvisories context={visit._id ? 'editVisit' : 'newVisit'} startOn={startOn} places={places} />
    </Container>
}
