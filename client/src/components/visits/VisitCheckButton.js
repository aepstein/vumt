import React from 'react'
import {
    Button
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function VisitCheckButton({visitId, checkedIn, checkedOut}) {
    const { t } = useTranslation(['visit'])
    const history = useHistory()

    if (!checkedIn) return <Button
        color="primary"
        size="sm"
        onClick={() => history.push('/visits/' + visitId + '/checkIn')}
    >{t('checkIn')}</Button>

    if (!checkedOut) return <Button
        color="primary"
        size="sm"
        onClick={() => history.push('/visits/' + visitId + '/checkOut')}
    >{t('checkOut')}</Button>

    return ""
}