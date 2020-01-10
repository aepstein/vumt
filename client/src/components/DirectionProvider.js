import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DirectionProvider = ({children}) => {
    const [dir, setDir] = useState('ltr')
    const { i18n } = useTranslation()

    useEffect(()=>{
        if (i18n && i18n.dir() !== dir) {
            setDir(i18n.dir())
        }   
    },[i18n])

    return <div dir={dir} className={dir}>
        {children}
    </div>
}

export default DirectionProvider
