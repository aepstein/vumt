import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelVisit, deleteVisit, getCurrentVisit } from '../../actions/visitActions'
import VisitPlanner from '../../components/visits/VisitPlanner'

export default function CurrentVisitManager({}) {
    const visit = useSelector(state => state.visit.current)
    const loading = useSelector(state => state.visit.currentLoading)
    const loaded = useSelector(state => state.visit.currentLoaded)

    const [visit,setVisit] = useState(null)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onCancel = (id) => {
        dispatch(cancelVisit(id))
    }
    const onDelete = (id) => {
        dispatch(deleteVisit(id))
    }

    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getCurrentVisit)
        }
    },[loading,loaded,dispatch])

    if (visit) {
        if (visit.checkedIn && !visit.checkedOut) {
            // Show checkout button
        }
        if (!visit.checkedIn) {
            // Show check in now
        }
    }
    return <VisitPlanner/>
}
