import React from 'react'
import {
    Alert,
    Container
} from 'reactstrap'
import { useSelector } from 'react-redux'

export default function AlertsManager() {
    const msg = useSelector(state => state.error.msg)
    
    if (msg.msg) return <Container>
        <Alert color="danger">{msg.msg}</Alert>
    </Container>

    return null
}