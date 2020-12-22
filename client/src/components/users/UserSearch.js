import React from 'react'
import {
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { filterUsers } from '../../actions/userActions'

export default function UserSearch() {
    const q = useSelector(state => state.user.q)
    const dispatch = useDispatch()

    const { t } = useTranslation('search')

    const onChange = (e) => {
        if (q !== e.target.value)
        dispatch(filterUsers(e.target.value))
    }

    return <Form inline>
        <FormGroup>
            <Label for="q">{t('search')}</Label>
            <Input type="text" name="q" value={q} onChange={onChange} />
        </FormGroup>
    </Form>
}