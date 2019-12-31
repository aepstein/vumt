import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DirectionProvider = ({children}) => {
    const [dir, setDir] = useState('ltr')
    const { i18n } = useTranslation()

    useEffect(()=>{
        if (i18n && i18n.dir() != dir) {
            setDir(i18n.dir())
        }   
    })

    return <div dir={dir} class={dir}>
        {children}
    </div>
}

export default DirectionProvider
