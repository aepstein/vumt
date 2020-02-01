import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export default function VisitCheckedOutDetail({visit}) {
    const { t, i18n } = useTranslation('visit')

    if (visit.checkedOut) return <Fragment>
        <dt>{t('checkedOutDate')}</dt>
        <dd>{visit.checkedOut ?          
            Intl.DateTimeFormat(i18n.language,{timeZone: visit.origin.timezone}).format(visit.checkedOut) : ""
        }</dd>
        <dt>{t('checkedOutTime')}</dt>
        <dd>{visit.checkedOut ?
            (new Date(visit.checkedOut)).toLocaleTimeString(i18n.language,{timeZone: visit.origin.timezone}) : ""
        }</dd>
    </Fragment>
    return ""
}