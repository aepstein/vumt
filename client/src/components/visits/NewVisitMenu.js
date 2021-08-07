import React, { useCallback } from 'react'
import { Redirect, useRouteMatch, useHistory } from 'react-router-dom'
import { Button, Spinner } from 'reactstrap'
import { useTranslation } from 'react-i18next'

export default function NewVisitMenu({
    location,
    nearestOrigin,
    nearestOriginLoaded,
    setOrigin,
    setStartOn,
    setAutoCheckIn })
{
    const { path } = useRouteMatch()
    const history = useHistory()
    const { t } = useTranslation(['visit','place','translation','uom','error'])

    const departNow = useCallback(() => {
        setOrigin(nearestOrigin)
        setStartOn(new Date())
        setAutoCheckIn(true)
        history.push(`${path}/destinations`)
    },[nearestOrigin,setOrigin,setStartOn,setAutoCheckIn,history,path])
    const departLater = useCallback(() => {
        setOrigin(null)
        setStartOn('')
        setAutoCheckIn(false)
        history.push(`${path}/departure`)
    },[setOrigin,setStartOn,setAutoCheckIn,history,path])
    const cancel = useCallback(() => {
        history.goBack()
    },[history])

    if (location && !nearestOriginLoaded) return <Spinner color="primary"/>
    if (nearestOrigin && nearestOrigin.distance < 1000) {
        return <div>
            <p>{t('visit:selectNowOrLater')}</p>
            <Button color="primary" onClick={departNow}>{t('visit:departNow',{origin: nearestOrigin.name})}</Button>
            <Button color="secondary" onClick={departLater}>{t('visit:departLater')}</Button>
            <Button color="danger" onClick={cancel}>{t('translation:cancel')}</Button>
        </div>
    }
    return <Redirect to={`${path}/departure`}/>
}