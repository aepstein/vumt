import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import useToken from '../../hooks/useToken'
import VisitEditor from '../../components/visits/VisitEditor'
import Spinner from '../../components/Spinner'
import { addVisit } from '../../actions/visitActions'

export default function VisitManager() {
    const { visitId, action } = useParams()
    const [ visit, setVisit ] = useState({})
    const [ loading, setLoading ] = useState(false)

    const dispatch = useDispatch()
    const saving = useSelector( state => state.visit.visitSaving )

    const history = useHistory()
    const tokenConfig = useToken()

    const onSave = (newProps) => {
        if (saving) return
        if (visit._id) {
            // TODO
        }
        else {
            dispatch(addVisit(newProps,history))
        }
    }
    
    useEffect(() => {
        if (loading) return
        if (visitId !== 'new') {
            if (visitId === visit._id) return
            setLoading(true)
            axios.get( '/api/visits/' + visitId, tokenConfig )
                .then((res) => {
                    setVisit(res.body)
                })
            setLoading(false)
        }
    },[visit,visitId,setVisit,loading,setLoading,tokenConfig])

    if (loading) return <Spinner/>

    switch(action) {
        // case 'show':
        //     return <VisitDetail visit={visit}/>
        default:
            return <VisitEditor visit={visit} onSave={onSave} saving={saving}/>
    }
}