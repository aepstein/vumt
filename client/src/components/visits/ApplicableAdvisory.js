import React, {useEffect, useState} from 'react'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import { useTranslation } from 'react-i18next'


export default function ApplicableAdvisory({advisory}) {
    const [prompts,setPrompts] = useState([])
    const [prompt,setPrompt] = useState({__html: ''})
    const [promptLanguage,setPromptLanguage] = useState('')
    const {i18n} = useTranslation(['advisory'])
    useEffect(() => {
        if (advisory.prompts) {
            setPrompts(advisory.prompts)
        }
        else {
            setPrompts([])
        }
    },[advisory.prompts])
    useEffect(() => {
        const promptLanguages = prompts.map((prompt) => {
            return prompt.language
        })
        const newPromptLanguage = i18n.languages.find((language) => {
            return promptLanguages.includes(language)
        })
        if (newPromptLanguage && newPromptLanguage !== promptLanguage) {
            setPromptLanguage(newPromptLanguage)
        }
    },[i18n.languages,prompts,promptLanguage])
    useEffect(() => {
        const newPrompt = prompts.find((prompt) => { return prompt.language === promptLanguage})
        setPrompt(newPrompt ? {__html: newPrompt.translationHTML } : {__html: ''})
    },[promptLanguage,setPrompt,prompts])

    return <Card>
        <CardBody>
            <CardTitle>{advisory.label}</CardTitle>
            <div className="card-text" dangerouslySetInnerHTML={prompt}></div>
        </CardBody>
    </Card>
}