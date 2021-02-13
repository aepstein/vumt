import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteTheme, filterThemes, getThemes, saveTheme } from '../../actions/themeActions'
import ThemesList from '../../components/themes/ThemesList'
import ThemeDetail from '../../components/themes/ThemeDetail'
import ThemeEditor from '../../components/themes/ThemeEditor'

const BLANK_THEME = {
    name: '',
    color: '',
    labels: []
}

export default function ThemesManager({action}) {
    const { defaultAction, themeId } = useParams()
    const themes = useSelector(state => state.theme.themes, shallowEqual)
    const loading = useSelector(state => state.theme.themesLoading)
    const loaded = useSelector(state => state.theme.themesLoaded)
    const next = useSelector(state => state.theme.next)
    const q = useSelector(state => state.theme.q)
    const saving = useSelector(state => state.theme.themeSaving)

    const [theme,setTheme] = useState(BLANK_THEME)

    const dispatch = useDispatch()

    const history = useHistory()
    
    const onDelete = (id) => {
        dispatch(deleteTheme(id))
    }
    const onLoadMore = () => {
        if (loading || !next) { return }
        dispatch(getThemes)
    }
    const onSave = (newProps) => {
        if (saving) return
        dispatch(saveTheme(newProps,history))
    }
    const onSearch = (q) => {
        dispatch(filterThemes(q))
    }
    
    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(getThemes)
        }
    },[loading,loaded,dispatch])

    useEffect(() => {
        if (theme && theme._id === themeId) return
        if (themeId && loaded) {
            const loadedTheme = themes.filter(v => v._id === themeId)[0]
            // TODO -- how to handle a theme that does not match loaded themes?
            if (!loadedTheme) return
            setTheme(loadedTheme)
        }
        else {
            setTheme(BLANK_THEME)
        }
    },[theme,themeId,loaded,themes])

    switch (action ? action : defaultAction) {
        case 'new':
        case 'edit':
            return <ThemeEditor theme={theme} onSave={onSave} saving={saving} action={action} />
        case 'show':
            return <ThemeDetail theme={theme} />
        default:
            return <ThemesList themes={themes} q={q} loading={loading} next={next}
                onDelete={onDelete} onLoadMore={onLoadMore} onSearch={onSearch} />
    }
}
