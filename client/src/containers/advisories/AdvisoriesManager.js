import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getAdvisories, saveAdvisory } from '../../actions/advisoryActions';
import { Spinner } from 'reactstrap'
import AdvisoriesList from '../../components/advisories/AdvisoriesList'
import AdvisoryDetail from '../../components/advisories/AdvisoryDetail'
import AdvisoryEditor from '../../components/advisories/AdvisoryEditor'

const BLANK_ADVISORY = {
    label: '',
    prompt: ''
}

export default function AdvisoriesManager({action}) {
    const { defaultAction, advisoryId } = useParams()
    const advisories = useSelector(state => state.advisory.advisories, shallowEqual)
    const loading = useSelector(state => state.advisory.advisoriesLoading)
    const loaded = useSelector(state => state.advisory.advisoriesLoaded)
    const saving = useSelector(state => state.advisory.advisorySaving)

    const [advisory,setAdvisory] = useState(BLANK_ADVISORY)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveAdvisory(newProps,history))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getAdvisories())
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (advisory && advisory._id === advisoryId) return
        if (advisoryId && loaded) {
            const loadedAdvisory = advisories.filter(v => v._id === advisoryId)[0]
            // TODO -- how to handle a advisory that does not match loaded advisories?
            if (!loadedAdvisory) return
            setAdvisory(loadedAdvisory)
        }
        else {
            setAdvisory(BLANK_ADVISORY)
        }
    },[advisory,advisoryId,loaded,advisories])

    if (loading) return <Spinner color="secondary" />

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <AdvisoryEditor advisory={advisory} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <AdvisoryDetail advisory={advisory} />
        default:
            return <AdvisoriesList advisories={advisories} />
    }
}
