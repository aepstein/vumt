import React, { useState, useEffect } from 'react'
import {
    Button,
    Container
} from 'reactstrap'
import {
    useHistory
} from 'react-router-dom'
import countries from '../../lib/countries'
import { useTranslation } from 'react-i18next'

export default function UserDetail({user}) {
    const { t, i18n } = useTranslation('commonForms')
    const history = useHistory()

    const [country,setCountry] = useState('')
    useEffect(() => {
        const language = i18n.language ? i18n.language.substring(0,2) : 'en'
        setCountry(countries.getName(user.country,language))
    },[i18n.language,user.country,setCountry])

    return <Container>
        <h1>{t('user:profile')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/profile/edit')}>{t('edit')}</Button>
        </div>
        <dl>
            <dt>{t('firstName')}</dt>
            <dd>{user.firstName}</dd>
            <dt>{t('lastName')}</dt>
            <dd>{user.lastName}</dd>
            <dt>{t('email')}</dt>
            <dd>{user.email}</dd>
            <dt>{t('country')}</dt>
            <dd>{country}</dd>
            <dt>{t('province')}</dt>
            <dd>{user.province}</dd>
            <dt>{t('postalCode')}</dt>
            <dd>{user.postalCode}</dd>
        </dl>
    </Container>
}
