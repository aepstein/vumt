import React, { useState, useEffect } from 'react'
import {
    Alert,
    Container
} from 'reactstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function AlertsManager() {
    const msg = useSelector(state => state.error.msg)
    const {t} = useTranslation('error')

    const [alert,setAlert] = useState(null)

    useEffect(() => {
        if (!msg.code) {
            setAlert(msg.msg)
            return
        }
        setAlert((() => {
            switch(msg.code) {
                case 'AUTH_NEED_ROLE':
                    return t(msg.code,{roles: msg.roles})
                default:
                    return t(msg.code)
            }
        })())
    },[msg,setAlert,t])
    
    if (alert) return <Container>
        <Alert color="danger">{alert}</Alert>
    </Container>

    return null
}