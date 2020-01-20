import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getVisits, saveVisit } from '../../actions/visitActions';
import { Spinner } from 'reactstrap'
import VisitsList from '../../components/visits/VisitsList'
import VisitDetail from '../../components/visits/VisitDetail'
import VisitEditor from '../../components/visits/VisitEditor'

export default function VisitsManager({action}) {
    const { defaultAction, visitId } = useParams()
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const loading = useSelector(state => state.visit.visitsLoading)
    const loaded = useSelector(state => state.visit.visitsLoaded)
    const saving = useSelector(state => state.visit.visitSaving)

    const [visit,setVisit] = useState({
        startOn: '',
        origin: {},
        destinations: [],
        groupSize: ''
    })

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveVisit(newProps,history))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getVisits())
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (visit && visit._id === visitId) return
        if (visitId && loaded) {
            const loadedVisit = visits.filter(v => v._id === visitId)[0]
            // TODO -- how to handle a visit that does not match loaded visits?
            if (!loadedVisit) return
            setVisit(loadedVisit)
        }
    },[visit,visitId,loaded,visits])

    if (loading) return <Spinner color="secondary" />

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <VisitEditor visit={visit} onSave={onSave} saving={saving} />
        case 'show':
            return <VisitDetail visit={visit} />
        default:
            return <VisitsList visits={visits} />
    }
}
