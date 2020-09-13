import React, { useState, useEffect } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import locales from '../locales'

function LanguageSelector() {
    const [ dropdownOpen, setDropdownOpen ] = useState(false)
    const [ lang, setLang ] = useState(null)
    const { t, i18n } = useTranslation('AppNavbar')

    const toggle = () => setDropdownOpen(prevState => !prevState)
    const setLanguage = (newLang) => () => {
        setLang(newLang)
    }

    useEffect(() => {
        if (i18n.lng !== lang) {
            i18n.changeLanguage(lang)
        }
    },[lang,i18n])

    return <div>
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className="language-selector">
            <DropdownToggle caret>{t('language')}</DropdownToggle>
            <DropdownMenu>
                {locales.map((language) => {
                    return <DropdownItem key={language.code}
                        onClick={setLanguage(language.code)}>{language.name}</DropdownItem>    
                })}
            </DropdownMenu>
        </Dropdown>
    </div>
}

export default LanguageSelector