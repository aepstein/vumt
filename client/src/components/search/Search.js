import React from 'react'
import {
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { useTranslation } from 'react-i18next'

export default function Search({q,onSearch}) {
    const { t } = useTranslation(['search'])

    const onChange = (e) => {
        if (q !== e.target.value)
        onSearch(e.target.value)
    }

    return <Form inline>
        <FormGroup>
            <Label for="q">{t('search')}</Label>
            <Input type="text" name="q" value={q} onChange={onChange} />
        </FormGroup>
    </Form>
}