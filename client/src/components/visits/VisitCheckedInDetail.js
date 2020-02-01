import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export default function VisitCheckedInDetail({visit}) {
    const { t, i18n } = useTranslation('visit')

    if (visit.checkedIn) return <Fragment>
        <dt>{t('checkedInDate')}</dt>
        <dd>{visit.checkedIn ?          
            Intl.DateTimeFormat(i18n.language,{timeZone: visit.origin.timezone}).format(visit.checkedIn) : ""
        }</dd>
        <dt>{t('checkedInTime')}</dt>
        <dd>{visit.checkedIn ?
            (new Date(visit.checkedIn)).toLocaleTimeString(i18n.language,{timeZone: visit.origin.timezone}) : ""
        }</dd>
    </Fragment>
    return ""
}