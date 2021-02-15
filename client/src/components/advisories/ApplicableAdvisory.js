import React from 'react'
import useTranslations from '../../hooks/useTranslations'

export default function ApplicableAdvisory({advisory}) {
    const prompt = useTranslations({fallback: advisory.label, translations: advisory.prompts, html: true})

    return <div className="card-text" dangerouslySetInnerHTML={{__html: prompt}}></div>
}