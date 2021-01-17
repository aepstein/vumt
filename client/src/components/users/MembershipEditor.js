import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Col,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import {
    AsyncTypeahead,
    Typeahead
} from 'react-bootstrap-typeahead'
import axios from 'axios'
import roleOptions from '../../lib/roles'
import { useTranslation } from 'react-i18next'

export default function MembershipEditor({membership,removeMembership,setMembership,index,errors}) {
    const { t } = useTranslation(['user','membership','organization','translation'])

    const setOrganization = (organization) => {
        setMembership({
            ...membership,
            organization
        })
    }
    const setRoles = (roles) => {
        setMembership({
            ...membership,
            roles
        })
    }
    const [organizationOptions, setOrganizationOptions ] = useState([])
    useEffect(() => {
        const organization = membership.organization._id ?
            [{id: membership.organization._id, label: membership.organization.name}] : []
        setOrganizationOptions(organization)
    },[membership.organization,setOrganizationOptions])
    const [ organizationsLoading, setOrganizationsLoading ] = useState(false)
    const organizationsSearch = useCallback((q) => {
        const params = {q}
        setOrganizationsLoading(true)
        axios
            .get('/api/organizations',{params})
            .then((res) => {
                setOrganizationOptions(res.data.data.map((organization) => {
                    return {id: organization._id, label: organization.name}
                }))
                setOrganizationsLoading(false)
            })
    },[setOrganizationsLoading,setOrganizationOptions])
    const initOrganizationsSearch = useCallback(() => {
        if (organizationOptions.length > 0) return
        organizationsSearch()
    },[organizationOptions,organizationsSearch])

    return <div className="membership">
        <div className="clearfix">
            <div className="text-muted float-left">{t('membership:membershipn',{n: index + 1})}</div>
            <Button className="float-right" color="danger" onClick={removeMembership}>{t('translation:remove')}</Button>
        </div>
        <Row form>
            <Col>
                <FormGroup>
                    <Label for={`memberships[${index}][organization]`}>{t('organization:organization')}</Label>
                    <AsyncTypeahead
                        id={`memberships_${index}_organization`}
                        name={`memberships[${index}][organization]`}
                        selected={membership.organization}
                        placeholder={t('organization:organizationPlaceholder')}
                        options={organizationOptions}
                        isLoading={organizationsLoading}
                        delay={200}
                        onSearch={organizationsSearch}
                        onFocus={initOrganizationsSearch}
                        onChange={(selected) => setOrganization(selected)}
                        isInvalid={errors.organization}
                        minLength={0}
                        clearButton={true}
                    />
                    {errors.organization && <Input type="hidden" invalid />}
                    {errors.organization && errors.organization.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <Label for={`memberships[${index}][roles]`}>{t('roles')}</Label>
                    <Typeahead
                        id={`memberships_${index}_roles`}
                        name={`memberships[${index}][roles]`}
                        multiple
                        selected={membership.roles}
                        placeholder={t('rolesPlaceholder')}
                        options={roleOptions}
                        onChange={(selected) => setRoles(selected)}
                        clearButton={true}
                    />                        
                </FormGroup>
            </Col>
        </Row>
    </div>
}