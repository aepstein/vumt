import React from 'react'
import {
    Button,
    Container,
    Spinner
} from 'reactstrap'
import {
    useHistory
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function OrganizationDetail({organization}) {
    const { t } = useTranslation(['organization','translation'])
    const history = useHistory()

    if (!organization._id) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('organizationDetail')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/organizations/' + organization.id + '/edit')}
            >{t('translation:edit')}</Button>
        </div>
        <dl>
            <dt>{t('name')}</dt>
            <dd>{organization.name}</dd>
        </dl>
    </Container>
}
