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

export default function AdvisoryDetail({advisory}) {
    const { t } = useTranslation('advisory')
    const history = useHistory()

    if (!advisory._id) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('advisoryDetail')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/advisories/' + advisory.id + '/edit')}
            >{t('commonForms:edit')}</Button>
        </div>
        <dl>
            <dt>{t('label')}</dt>
            <dd>{advisory.label}</dd>
            <dt>{t('prompt')}</dt>
            <dd>{advisory.prompt}</dd>
        </dl>
    </Container>
}
