import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteOrganization, filterOrganizations, getOrganizations, saveOrganization } from '../../actions/organizationActions'
import OrganizationsList from '../../components/organizations/OrganizationsList'
import OrganizationDetail from '../../components/organizations/OrganizationDetail'
import OrganizationEditor from '../../components/organizations/OrganizationEditor'

const BLANK_DISTRICT = {
    name: ''
}

export default function OrganizationsManager({action}) {
    const { defaultAction, organizationId } = useParams()
    const organizations = useSelector(state => state.organization.organizations, shallowEqual)
    const loading = useSelector(state => state.organization.organizationsLoading)
    const loaded = useSelector(state => state.organization.organizationsLoaded)
    const next = useSelector(state => state.organization.next)
    const q = useSelector(state => state.organization.q)
    const saving = useSelector(state => state.organization.organizationSaving)

    const [organization,setOrganization] = useState(BLANK_DISTRICT)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onDelete = (id) => {
        dispatch(deleteOrganization(id))
    }
    const onLoadMore = () => {
        if (loading || !next) { return }
        dispatch(getOrganizations)
    }
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveOrganization(newProps,history))
    }
    const onSearch = (q) => {
        dispatch(filterOrganizations(q))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getOrganizations)
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (organization && organization._id === organizationId) return
        if (organizationId && loaded) {
            const loadedOrganization = organizations.filter(v => v._id === organizationId)[0]
            // TODO -- how to handle a organization that does not match loaded organizations?
            if (!loadedOrganization) return
            setOrganization(loadedOrganization)
        }
        else {
            setOrganization(BLANK_DISTRICT)
        }
    },[organization,organizationId,loaded,organizations])

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <OrganizationEditor organization={organization} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <OrganizationDetail organization={organization} />
        default:
            return <OrganizationsList organizations={organizations} q={q} loading={loading} next={next}
                onDelete={onDelete} onLoadMore={onLoadMore} onSearch={onSearch} />
    }
}
