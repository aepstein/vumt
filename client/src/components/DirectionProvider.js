import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { loadUser } from '../actions/authActions'

const DirectionProvider = ({children}) => {
    const [dir, setDir] = useState('ltr')
    const { i18n } = useTranslation()

    const dispatch = useDispatch()

    useEffect(()=>{
        if (i18n && i18n.dir() !== dir) {
            setDir(i18n.dir())
        }   
    },[i18n,dir])

    useEffect(() => {
        dispatch(loadUser())
    },[dispatch])

    return <div dir={dir} className={dir}>
        {children}
    </div>
}

export default DirectionProvider
