import React, { useState, useCallback, useRef } from 'react'
import {
    FormFeedback,
    FormGroup,
    Input,
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

export default function ThemeSelect({name,register,errors,theme,setTheme}) {
    const { t } = useTranslation('theme','translation')
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
            name={name ? name : "theme"}
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
            isInvalid={errors ? true : false}
        />
        <Input type="hidden" name={`${name ? name : 'theme'}Hidden`} invalid={errors ? true : false} />
        {(errors && errors.type === 'required') ? <FormFeedback>{t('translation:invalidRequired')}</FormFeedback> : ''}
    </FormGroup>
}