import React, { useState, useEffect } from 'react'
import {
    Alert,
    Container
} from 'reactstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function NoticesManager() {
    const msg = useSelector(state => state.notice.msg)
    const {t} = useTranslation('notice')

    const [notice,setNotice] = useState(null)

    useEffect(() => {
        if (!msg.code) {
            setNotice(msg.msg)
            return
        }
        setNotice((() => {
            switch(msg.code) {
                case 'AUTH_NEED_ROLE':
                    return t(msg.code,{roles: msg.roles})
                case 'MODEL_RESTRICTED_KEY':
                    return t(msg.code,{key: msg.key, dependent: msg.dependent, model: msg.model})
                default:
                    return t(msg.code)
            }
        })())
    },[msg,setNotice,t])
    
    if (notice) return <Container>
        <Alert color="danger">{notice}</Alert>
    </Container>

    return null
}