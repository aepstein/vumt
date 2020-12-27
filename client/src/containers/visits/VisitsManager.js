import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteVisit, filterVisits, getVisits, saveVisit } from '../../actions/visitActions';
import VisitsList from '../../components/visits/VisitsList'
import VisitDetail from '../../components/visits/VisitDetail'
import VisitEditor from '../../components/visits/VisitEditor'
import VisitCheckIn from '../../components/visits/VisitCheckIn'
import VisitCheckOut from '../../components/visits/VisitCheckOut'

export default function VisitsManager({action}) {
    const { defaultAction, visitId } = useParams()
    const initNext = useSelector(state => state.visit.initNext)
    const next = useSelector(state => state.visit.next)
    const q = useSelector(state => state.visit.q)
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const loading = useSelector(state => state.visit.visitsLoading)
    const loaded = useSelector(state => state.visit.visitsLoaded)
    const saving = useSelector(state => state.visit.visitSaving)

    const [visit,setVisit] = useState({
        startOnDate: '',
        startOnTime: '',
        origin: {},
        destinations: [],
        groupSize: '',
        durationNights: '',
        checkedIn: '',
        checkedOut: '',
        parkedVehicles: ''
    })

    const dispatch = useDispatch()

    const history = useHistory()
    
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
        }
    },[visit,visitId,loaded,visits])

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <VisitEditor visit={visit} onSave={onSave} saving={saving} />
        case 'checkIn':
            return <VisitCheckIn visit={visit} onSave={onSave} saving={saving} />
        case 'checkOut':
            return <VisitCheckOut visit={visit} onSave={onSave} saving={saving} />
        case 'show':
            return <VisitDetail visit={visit} />
        default:
            return <VisitsList loading={loading} next={next} q={q} visits={visits}
                onDelete={onDelete} onLoadMore={onLoadMore} onSearch={onSearch} />
    }
}
