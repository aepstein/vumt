import React from 'react';
import {
    Container
} from 'reactstrap';
import { useTranslation } from 'react-i18next'

export default function VisitDetail({visit}) {
    const { t, i18n } = useTranslation('visit')

    return <Container>
        <h1>{t('detailHeading')}</h1>
        <dl>
            <dt>{t('startOnDate')}</dt>
            <dd>{Intl.DateTimeFormat(i18n.language).format(visit.startOn)}</dd>
            <dt>{t('startOnTime')}</dt>
            <dd>{(new Date(visit.startOn)).toLocaleTimeString()}</dd>
            <dt>{t('origin')}</dt>
            <dd>{visit.origin.name}</dd>
            <dt>{t('destinations')}</dt>
            <dd>{visit.destinations.map(d => d.name).join(', ')}</dd>
            <dt>{t('groupSize')}</dt>
            <dd>{visit.groupSize}</dd>
            <dt>{t('durationNights')}</dt>
            <dd>{visit.durationNights}</dd>
        </dl>
    </Container>
}
