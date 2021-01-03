import React from 'react';
import {
    Button
} from 'reactstrap'
import MembershipEditor from './MembershipEditor'
import {useTranslation} from 'react-i18next'

export default function MembershipsEditor({memberships,setMemberships,onAddMembership,errors}) {
    const {t} = useTranslation('user')

    const setMembership = (index) => ({organization,roles}) => {
        const newMemberships = [...memberships]
        newMemberships[index] = { organization, roles }
        setMemberships(newMemberships)
    }
    const removeMembership = (index) => () => {
        const newMemberships = [...memberships]
        newMemberships.splice(index,1)
        setMemberships(newMemberships)
    }
    const membershipErrors = (index,errors) => {
        if (errors && errors.memberships && errors.memberships[index]) {
            return errors.memberships[index]
        }
        return {}
    } 

    return <div>
        <h3>{t('membership:memberships')}</h3>
        <Button color="secondary" onClick={onAddMembership}>{t('membership:addMembership')}</Button>
        {memberships.map((membership,index) => {
            return <MembershipEditor membership={membership} removeMembership={removeMembership(index)}
                setMembership={setMembership(index)} errors={membershipErrors(index,errors)}
                index={index} key={index} />
    })}</div>
}