import React from 'react'
import TranslationDefinition from './TranslationDefinition'

export default function TranslationDefinitions({translations}) {
    return <dl>
        {translations && translations.map(({language,translationHTML},index) => {
            return <TranslationDefinition language={language} translation={translationHTML} key={index} />
        })}
    </dl>
}
