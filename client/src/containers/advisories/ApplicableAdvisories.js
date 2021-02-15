import axios from 'axios'
import prepareTokenConfig from '../../lib/prepareTokenConfig'
import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap'
import { useSelector } from 'react-redux';
import ApplicableTheme from '../../components/advisories/ApplicableTheme'

export default function ApplicableAdvisories({visit,context,startOn,places}) {
    const token = useSelector((state) => state.auth.token)
    const [ applicableAdvisories, setApplicableAdvisories ] = useState([])
    const [ applicableAdvisoriesLoading, setApplicableAdvisoriesLoading ] = useState(false)
    const [ applicableAdvisoriesLoaded, setApplicableAdvisoriesLoaded ] = useState(false)
    const [ url, setUrl ] = useState('')
    useEffect(() => {
        let newUrl = ''
        if (visit) {
            if (visit._id) { newUrl = '/api/visits/' + visit._id + '/applicableAdvisories/' + context }
        }
        else {
            newUrl = '/api/advisories/applicable/' + context
        }
        if ( newUrl && newUrl !== url ) {
            setUrl(newUrl)
            setApplicableAdvisoriesLoaded(false)
        }
    },[url,visit,context,setUrl,setApplicableAdvisoriesLoaded])
    useEffect( () => {
        if (url && !applicableAdvisoriesLoading && !applicableAdvisoriesLoaded) {
            const params = {}
            if (startOn) { params.startOn = startOn.valueOf() }
            if (places) { params.places = JSON.stringify(places) }
            const options = {
                ...prepareTokenConfig(token),
                params
            }
            setApplicableAdvisoriesLoading(true)
            axios
            .get(url,options)
            .then((res) => {
                setApplicableAdvisories(res.data.map(
                    theme => <ApplicableTheme  key={theme._id} theme={theme}/>
                ))
                setApplicableAdvisoriesLoaded(true)
                setApplicableAdvisoriesLoading(false)
            })
        }
    },[url, startOn, places, applicableAdvisories, applicableAdvisoriesLoading, applicableAdvisoriesLoaded,
    setApplicableAdvisories, setApplicableAdvisoriesLoading, setApplicableAdvisoriesLoaded, token])
    useEffect(() => {
        setApplicableAdvisoriesLoaded(false)
    },[context,startOn,places])

    if (applicableAdvisoriesLoading) { return <Spinner color="secondary"/> }

    return <div className="applicable-advisories">{applicableAdvisories}</div>
}