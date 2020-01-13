import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getVisits } from '../../actions/visitActions';
import Spinner from '../../components/Spinner'
import VisitsList from '../../components/visits/VisitsList'

export default function VisitsManager() {
    const visits = useSelector(state => state.visit.visits, shallowEqual)
    const loading = useSelector(state => state.visit.visitsLoading)
    const loaded = useSelector(state => state.visit.visitsLoaded)

    const dispatch = useDispatch()
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getVisits())
        }
    },[loading,loaded,dispatch])

    if (loading) return <Spinner />

    return <VisitsList visits={visits} loading={loading}/>
}
