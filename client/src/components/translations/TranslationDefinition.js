import React from 'react'
import locales from '../../locales'

export default function TranslationDefinition({language,translation}) {
    return <div>
        <dt>{locales.filter(t => t.code === language)[0].name}</dt>
        <dd dangerouslySetInnerHTML={{__html: translation}}></dd>
    </div>
}