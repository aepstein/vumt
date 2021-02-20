import {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'

/*
 * translations: The translations to search
 * fallback: The fallback string to use
 * html: If true, supply HTML string, otherwise supply plaintext
 */
export default function useTranslations({translations,fallback,html}) {
    const [translation,setTranslation] = useState('')
    const {i18n} = useTranslation()
    useEffect(() => {
        for (const language of i18n.languages) {
            const preciseTranslation = translations.find(translation => translation.language === language)
            const newTranslation = preciseTranslation ? preciseTranslation :
                translations.find(translation => translation.language.slice(0,2) === language.slice(0,2))
            if (newTranslation) {
                if (html) {
                    if (newTranslation.translationHTML === translation) { return }
                    setTranslation(newTranslation.translationHTML)
                }
                if (newTranslation.translation === translation) { return }
                setTranslation(newTranslation.translation)
                return
            }
        }
        setTranslation(fallback)
    },[translation,i18n.languages,fallback,translations,setTranslation,html])
    return translation
}