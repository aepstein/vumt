import React, { useCallback, useState } from 'react'
import {
    FormFeedback,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import {
    AsyncTypeahead
} from 'react-bootstrap-typeahead'
import {useTranslation} from 'react-i18next'
import useToken from '../../hooks/useToken'
import axios from 'axios'

const userOption = (user) => {
    return {id: user._id, label: `${user.firstName} ${user.lastName}`, user}
}

export default function UserSelect({user,setUser,errors}) {
    const selectedUser = useCallback(() => {
        if (user) { return [userOption(user)] }
        return []
    },[user])
    const setSelectedUser = useCallback((option) => {
        setUser(option[0].user)
    },[setUser])
    const [usersLoading, setUsersLoading] = useState(false)
    const [userOptions, setUserOptions ] = useState([])
    const token = useToken()
    const usersSearch = useCallback((q) => {
        const params = {q}
        setUsersLoading(true)
        axios
            .get('/api/users',{params, ...token})
            .then((res) => {
                setUserOptions(res.data.data.map((user) => {
                    return userOption(user)
                }))
                setUsersLoading(false)
            })
    },[setUsersLoading,setUserOptions,token])
    const initUsersSearch = useCallback(() => {
        if (userOptions.length > 0) return
        usersSearch()
    },[userOptions,usersSearch])

    const {t} = useTranslation('user')

    return <FormGroup>
        <Label for={'user'}>{t('user:user')}</Label>
        <AsyncTypeahead
            id="user"
            name="user"
            selected={selectedUser()}
            placeholder={t('user:userPlaceholder')}
            options={userOptions}
            isLoading={usersLoading}
            delay={200}
            onSearch={usersSearch}
            onFocus={initUsersSearch}
            onChange={(selected) => setSelectedUser(selected)}
            isInvalid={errors}
            minLength={0}
            clearButton={true}
        />
        {errors && <Input type="hidden" invalid />}
        {errors && errors.type === 'required' &&
            <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
    </FormGroup>
}