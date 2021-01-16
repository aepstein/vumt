import React from 'react'
import {
    FormGroup,
    Label
} from 'reactstrap'
import {
    Typeahead
} from 'react-bootstrap-typeahead'
import roleOptions from '../../lib/roles'
import {useTranslation} from 'react-i18next'

export default function RolesSelect({roles,setRoles}) {
    const {t} = useTranslation(['user'])

    return <FormGroup>
        <Label for="roles">{t('roles')}</Label>
        <Typeahead
            id="roles"
            name="roles"
            multiple
            selected={roles}
            placeholder={t('rolesPlaceholder')}
            options={roleOptions}
            onChange={(selected) => setRoles(selected)}
            clearButton={true}
        />
    </FormGroup>
}