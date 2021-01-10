import React, { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteMembership, filterMemberships, getMemberships, initMemberships, saveMembership } from '../../actions/membershipActions'
import MembershipsList from '../../components/memberships/MembershipsList'
import MembershipEditor from '../../components/memberships/MembershipEditor'

export default function MembershipsManager({action}) {
    const { defaultAction, organizationId } = useParams()
    const memberships = useSelector(state => state.membership.memberships, shallowEqual)
    const organization = useSelector(state => state.membership.organization)
    const loading = useSelector(state => state.membership.membershipsLoading)
    const loaded = useSelector(state => state.membership.membershipsLoaded)
    const next = useSelector(state => state.membership.next)
    const q = useSelector(state => state.membership.q)
    const saving = useSelector(state => state.membership.membershipSaving)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onDelete = (userId) => () => {
        dispatch(deleteMembership(userId))
    }
    const onLoadMore = () => {
        if (loading || !next) { return }
        dispatch(getMemberships)
    }
    const onSave = useCallback((membership) => {
        if (saving) return
        const afterSave = () => {
            history.push(`/organizations/${organization._id}/memberships`)
        }
        dispatch(saveMembership(action === 'new',membership,afterSave))
    },[saving,history,organization,action,dispatch])
    const onSearch = (q) => {
        dispatch(filterMemberships(q))
    }
    const onEdit = useCallback((membership) => {
        history.push(`/organizations/${organization._id}/memberships/${membership.user._id}/edit`)
    },[history,organization])
    
    useEffect(() => {
        if (!organization || organizationId !== organization._id) {
            dispatch(initMemberships(organizationId))
        }
    },[organizationId,organization,dispatch])
    useEffect(() => {
        if (organization && !loading && !loaded) {
            dispatch(getMemberships)
        }
    },[loading,loaded,organization,dispatch])

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <MembershipEditor organization={organization} memberships={memberships}
                onSave={onSave} saving={saving} action={action} />
        default:
            return <MembershipsList organization={organization} memberships={memberships} q={q} loading={loading} next={next}
                onEdit={onEdit} onDelete={onDelete} onLoadMore={onLoadMore} onSearch={onSearch} />
    }
}
