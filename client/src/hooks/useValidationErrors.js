import {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

export default function useValidationErrors({setError}) {
    const { t } = useTranslation('error')
    const validationErrors = useSelector(state => state.error.validationErrors)

    useEffect(() => {
        if (validationErrors.length === 0) return
        validationErrors.forEach(({path,kind,value}) => {
            setError(path,kind,t(`${kind}`,{value}))
        })
    },[validationErrors,setError,t])
}