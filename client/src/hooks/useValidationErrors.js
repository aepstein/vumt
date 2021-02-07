import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

export default function useValidationErrors({setError}) {
    const { t } = useTranslation('notice')
    const validationErrors = useSelector(state => state.notice.validationErrors)

    useEffect(() => {
        if (validationErrors.length === 0) return
        validationErrors.forEach(({path,kind,value}) => {
            setError(path,{type: kind,message: t(`${kind}`,{value})})
        })
    },[validationErrors,setError,t])
}