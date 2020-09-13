import React, { useState, useEffect } from 'react'
import {
    Button,
    Container,
    Spinner
} from 'reactstrap'
import {
    useHistory
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import locales from '../../locales'

export default function AdvisoryDetail({advisory}) {
    const { t, i18n } = useTranslation('advisory')
    const history = useHistory()
    const [ timezone ] = useState('America/New_York')

    useEffect(() => {
        console.log(advisory.startOn)
    },[advisory.startOn])

    if (!advisory._id) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('advisoryDetail')}</h1>
        <p>{t('translation:timesAreLocal',{timezone: timezone})}</p>
        <div>
            <Button color="primary" onClick={() => history.push('/advisories/' + advisory.id + '/edit')}
            >{t('commonForms:edit')}</Button>
        </div>
        <dl>
            <dt>{t('label')}</dt>
            <dd>{advisory.label}</dd>
            <dt>{t('startOnDate')}</dt>
            <dd>{advisory.startOn ? Intl.DateTimeFormat(i18n.language,{timeZone: timezone}).format(advisory.startOn) : ''}</dd>
            <dt>{t('startOnTime')}</dt>
            <dd>{(new Date(advisory.startOn)).toLocaleTimeString(i18n.language,{timeZone: timezone})}</dd>
            <dt>{t('endOnDate')}</dt>
            <dd>{advisory.endOn ? Intl.DateTimeFormat(i18n.language,{timeZone: timezone}).format(advisory.endOn) : ''}</dd>
            <dt>{t('endOnTime')}</dt>
            <dd>{(new Date(advisory.endOn)).toLocaleTimeString(i18n.language,{timeZone: timezone})}</dd>
            <dt>{t('districts')}</dt>
            <dd>{advisory.districts.map(d => d.name).join(', ')}</dd>
        </dl>
        <h2>{t('prompts')}</h2>
        <dl>
        {advisory.prompts && advisory.prompts.map(({language,translation},index) => {
            return <div key={index}>
                <dt>{locales.filter(t => t.code === language)[0].name}</dt>
                <dd>{translation}</dd>
            </div>
        })}
        </dl>
    </Container>
}
