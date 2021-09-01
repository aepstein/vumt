import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { cancelVisit, deleteVisit, filterVisits, getVisits, saveVisit } from '../../actions/visitActions';
import VisitsList from '../../components/visits/VisitsList'
import VisitDetail from '../../components/visits/VisitDetail'
import VisitEditor from '../../components/visits/VisitEditor'
import VisitCheckIn from '../../components/visits/VisitCheckIn'
import VisitCheckOut from '../../components/visits/VisitCheckOut'

const NEW_VISIT = {
    startOnDate: '',
    startOnTime: '',
    origin: null,
    destinations: [],
    groupSize: '',
    durationNights: '',
    checkedIn: '',
    checkedOut: '',
    parkedVehicles: ''
}

export default function VisitsManager({action}) {
    const { defaultAction, visitId } = useParams()
    const initNext = useSelector(state => state.visit.initNext)
    const next = useSelector(state => state.visit.next)
    const q = useSelector(state => state.visit.q)
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const loading = useSelector(state => state.visit.visitsLoading)
    const loaded = useSelector(state => state.visit.visitsLoaded)
    const saving = useSelector(state => state.visit.visitSaving)

    const [visit,setVisit] = useState(null)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onCancel = (id) => {
        dispatch(cancelVisit(id))
    }
    const onDelete = (id) => {
        dispatch(deleteVisit(id))
    }
    const onLoadMore = () => {
        if (loading || !next) { return }
        dispatch(getVisits)
    }
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveVisit(newProps,history))
    }
    const onSearch = (q) => {
        dispatch(filterVisits(q))
    }

    useEffect(() => {
        if (initNext && !loading && !loaded) {
            dispatch(getVisits)
        }
    },[initNext,loading,loaded,dispatch])

    useEffect(() => {
        if (visit && visit._id === visitId) return
        if (visitId && loaded) {
            const loadedVisit = visits.filter(v => v._id === visitId)[0]
            // TODO -- how to handle a visit that does not match loaded visits?
            if (!loadedVisit) return
            setVisit(loadedVisit)
            return
        }
    },[visit,visitId,loaded,visits])

    switch (action ? action : defaultAction) {
        case 'new':
            return <VisitEditor visit={NEW_VISIT} onSave={onSave} saving={saving}/>
        case 'edit':
            if (!visit) return <Spinner color="primary"/>
            return <VisitEditor visit={visit} onSave={onSave} saving={saving} />
        case 'checkIn':
            if (!visit) return <Spinner color="primary"/>
            return <VisitCheckIn visit={visit} onSave={onSave} saving={saving} />
        case 'checkOut':
            if (!visit) return <Spinner color="primary"/>
            return <VisitCheckOut visit={visit} onSave={onSave} saving={saving} />
        case 'show':
            if (!visit) return <Spinner color="primary"/>
            return <VisitDetail visit={visit} />
        default:
            return new VisitsList({loading,next,q,visits,onCancel,onDelete,onLoadMore,onSearch})
    }
}
