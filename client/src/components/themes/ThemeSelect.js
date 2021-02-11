import React, { useState, useCallback, useRef } from 'react'
import {
    FormGroup,
    Label
} from 'reactstrap'
import {
    AsyncTypeahead,
    Highlighter
} from 'react-bootstrap-typeahead'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const themeToSelection = (theme) => {
    return {id: theme._id, label: theme.name}
}
const themesToSelections = (themes) => {
    return themes.map(themeToSelection)
}
const themeToSelections = (theme) => {
    if (!theme) { return [] }
    return [themeToSelection(theme)]
}
const selectionsToTheme = (selections) => {
    if (selections.length === 0) { return '' }
    const {id,label} = selections[0]
    return {_id: id, name: label}
}

export default function ThemeSelect({theme,setTheme}) {
    const { t } = useTranslation('theme')
    const themeRef = useRef()
    const [ themeOptions, setThemeOptions ] = useState([])
    const [ themesLoading, setThemesLoading ] = useState(false)
    const themeSearch = useCallback((q) => {
        setThemesLoading(true)
        axios
            .get('/api/themes',{params: {q}})
            .then((res) => {
                setThemeOptions(themesToSelections(res.data.data))
                setThemesLoading(false)
            })
    },[setThemesLoading,setThemeOptions])
    const initThemeSearch = useCallback(() => {
        if (themeOptions.length > 0) return
        themeSearch()
    },[themeOptions,themeSearch])
    const renderThemes = (option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>
        ]
    }

    return <FormGroup>
        <Label for="theme">{t('theme')}</Label>
        <AsyncTypeahead
            id="theme"
            name="theme"
            selected={themeToSelections(theme)}
            placeholder={t('themePlaceholder')}
            options={themeOptions}
            isLoading={themesLoading}
            onSearch={themeSearch}
            onChange={(selected) => setTheme(selectionsToTheme(selected))}
            onFocus={initThemeSearch}
            renderMenuItemChildren={renderThemes}
            ref={themeRef}
            delay={200}
            minLength={0}
            clearButton={true}
        />
    </FormGroup>
}