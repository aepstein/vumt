import React, {useState, useEffect} from 'react'
import {
    Input,
    FormGroup,
    Label
} from 'reactstrap'
import { useTranslation } from 'react-i18next'
import locales from '../../locales'
import TranslationEditor from './TranslationEditor'

export default function TranslationsEditor({register,errors,name,translations,setTranslations}) {
    const { t } = useTranslation('translation')
    const appendTranslation = (e) => {
        setTranslations([...translations, {language: e.target.value, translation: ''}])
    }
    const removeTranslation = (index) => () => {
        return () => {
            setTranslations(translations.filter((translation,i) => {return i !== index}))
        }
    }
    const updateTranslation = (index) => (field) => {
        return (e) => {
            const newVal = {...translations[index]}
            newVal[field] = e.target.value
            setTranslations([
                ...translations.slice(0,index),
                newVal,
                ...translations.slice(index+1)
            ])
        }
    }
    const [missingLocales,setMissingLocales] = useState([])
    useEffect(() => {
        const presentLocales = translations.map((translation) => {
            return translation.language
        })
        setMissingLocales(locales.filter(({code}) => {
            return !presentLocales.includes(code)
        }))
    },[translations,setMissingLocales])

    return <div>
        {translations.map((translation,index) => {
            return <TranslationEditor
                register={register}
                errors={errors[name] ? errors[name][index] : null}
                translation={translation}
                name={name}
                key={index}
                index={index}
                removeTranslation={removeTranslation(index)}
                updateTranslation={updateTranslation(index)}
            />
        })}
        {missingLocales.length > 0 ? <FormGroup>
            <Label for="addTranslation">{t('addTranslation')}</Label>
            <Input
                type="select"
                name="addTranslation"
                value=""
                onChange={appendTranslation}
            >
                <option value="">{t('selectLanguage')}</option>
                {missingLocales.map(({code,name},index) => {
                    return <option key={index} value={code}>{name}</option>
                })}
            </Input>
        </FormGroup> : ''}
    </div>
}