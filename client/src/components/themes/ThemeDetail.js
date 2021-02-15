import React from 'react'
import {
    Button,
    Container,
    Spinner
} from 'reactstrap'
import {
    useHistory
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TranslationDefinitions from '../translations/TranslationDefinitions'

export default function ThemeDetail({theme}) {
    const { t } = useTranslation(['theme','translation'])
    const history = useHistory()

    if (!theme._id) return <Spinner color="primary"/>

    return <Container>
        <h1>{t('themeDetail')}</h1>
        <div>
            <Button color="primary" onClick={() => history.push('/themes/' + theme.id + '/edit')}
            >{t('translation:edit')}</Button>
        </div>
        <dl>
            <dt>{t('translation:name')}</dt>
            <dd>{theme.name}</dd>
            <dt>{t('color')}</dt>
            <dd>{theme.color}</dd>
        </dl>
        <h2>{t('labels')}</h2>
        <TranslationDefinitions translations={theme.labels} />
    </Container>
}
