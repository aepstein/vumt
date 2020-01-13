import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getVisits } from '../../actions/visitActions';
import Spinner from '../../components/Spinner'
import VisitsList from '../../components/visits/VisitsList'
import VisitDetail from '../../components/visits/VisitDetail'

export default function VisitsManager({action}) {
    const { defaultAction, visitId } = useParams()
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const loading = useSelector(state => state.visit.visitsLoading)
    const loaded = useSelector(state => state.visit.visitsLoaded)

    const [visit,setVisit] = useState({
        startOn: '',
        origin: [],
        destinations: [],
        groupSize: ''
    })

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getVisits())
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (visit && visit._id === visitId) return
        if (visitId && loaded) {
            const loadedVisit = visits.filter(v => v._id === visitId)[0]
            if (loadedVisit) return setVisit(loadedVisit)
        }
    },[visit,visitId,loaded,visits])

    if (loading) return <Spinner />

    switch (action ? action : defaultAction) {
        case 'show':
            return <VisitDetail visit={visit} />
        default:
            return <VisitsList visits={visits} />
    }
}
