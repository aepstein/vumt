import axios from 'axios'
import prepareTokenConfig from '../../lib/prepareTokenConfig'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ApplicableAdvisory from '../../components/visits/ApplicableAdvisory'

export default function ApplicableAdvisories({visit}) {
    const token = useSelector((state) => state.auth.token)
    const [ applicableAdvisories, setApplicableAdvisories ] = useState([])
    const [ applicableAdvisoriesLoading, setApplicableAdvisoriesLoading ] = useState(false)
    const [ applicableAdvisoriesLoaded, setApplicableAdvisoriesLoaded ] = useState(false)
    useEffect( () => {
        if (visit._id && !applicableAdvisoriesLoading && !applicableAdvisoriesLoaded) {
            setApplicableAdvisoriesLoading(true)
            axios
            .get('/api/visits/' + visit._id + '/applicableAdvisories',prepareTokenConfig(token))
            .then((res) => {
                setApplicableAdvisories(res.data.map(
                    advisory => <ApplicableAdvisory  key={advisory._id} advisory={advisory}/>
                ))
                setApplicableAdvisoriesLoaded(true)
                setApplicableAdvisoriesLoading(false)
            })
        }
    },[visit._id, applicableAdvisories, applicableAdvisoriesLoading, applicableAdvisoriesLoaded,
    setApplicableAdvisories, setApplicableAdvisoriesLoading, setApplicableAdvisoriesLoaded, token])

    return <div className="applicable-advisories">{applicableAdvisories}</div>
}