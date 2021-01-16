import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Form
} from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'
import RolesSelect from '../roles/RolesSelect'
import UserSelect from '../users/UserSelect'

const BLANK_MEMBERSHIP = {
    user: null,
    roles: []
}

export default function MembershipEditor({organization,memberships,onSave,saving}) {
    const { t } = useTranslation('membership')
    const history = useHistory()
    const {userId} = useParams()

    const findMembership = useCallback(() => {
        const membership = memberships.find(m => m.user._id === userId)
        if (membership) { return {...membership} }
        return BLANK_MEMBERSHIP
    },[memberships,userId])
    const [membership] = useState(findMembership())

    const [ user, setUser ] = useState(membership.user)
    useEffect(() => {
        setUser(membership.user)
    },[membership.user,setUser])
    const [ roles, setRoles ] = useState(membership.roles)
    useEffect(() => {
        setRoles(membership.roles)
    },[membership.roles,setRoles])

    const { handleSubmit, setError, clearError, errors } = useForm()

    const onSubmit = () => {
        if (saving) return
        clearError()
        const newMembership = {
            user: user._id,
            roles
        }
        onSave(newMembership)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h1>{userId ?
                t('editMembershipHeading',{user: `${user.firstName} ${user.lastName}`,organization: organization.name}) : 
                t('addMembershipHeading',{organization: organization.name})}</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                {userId ? '' : <UserSelect user={user} setUser={setUser} errors={errors.user} />}
                <RolesSelect roles={roles} setRoles={setRoles} />
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{userId ?  t('updateMembership') : t('addMembership')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('commonForms:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
