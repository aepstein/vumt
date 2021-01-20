import axios from 'axios'
import prepareTokenConfig from '../../lib/prepareTokenConfig'
import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap'
import { useSelector } from 'react-redux';
import ApplicableAdvisory from '../../components/visits/ApplicableAdvisory'

export default function ApplicableAdvisories({visit,context}) {
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
            setApplicableAdvisoriesLoading(true)
            axios
            .get(url,prepareTokenConfig(token))
            .then((res) => {
                setApplicableAdvisories(res.data.map(
                    advisory => <ApplicableAdvisory  key={advisory._id} advisory={advisory}/>
                ))
                setApplicableAdvisoriesLoaded(true)
                setApplicableAdvisoriesLoading(false)
            })
        }
    },[url, applicableAdvisories, applicableAdvisoriesLoading, applicableAdvisoriesLoaded,
    setApplicableAdvisories, setApplicableAdvisoriesLoading, setApplicableAdvisoriesLoaded, token])

    if (applicableAdvisoriesLoading) { return <Spinner color="secondary"/> }

    return <div className="applicable-advisories">{applicableAdvisories}</div>
}