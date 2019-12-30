import React, { useState, useEffect } from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { useTranslation } from 'react-i18next'

function LanguageSelector() {
    const [ dropdownOpen, setDropdownOpen ] = useState(false)
    const [ lang, setLang ] = useState(null)
    const { t, i18n } = useTranslation('AppNavbar')

    const toggle = () => setDropdownOpen(prevState => !prevState)
    const setLanguage = (newLang) => () => {
        setLang(newLang)
    }

    useEffect(() => {
        if (i18n.lng != lang) {
            i18n.changeLanguage(lang)
        }
    },[lang])

    return <div>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>{t('language')}</DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={setLanguage('en-US')}>English</DropdownItem>
                <DropdownItem onClick={setLanguage('fr')}>Français</DropdownItem>
                <DropdownItem onClick={setLanguage('he')}>עברית</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
}

export default LanguageSelector