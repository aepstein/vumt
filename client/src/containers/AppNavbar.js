import React, { Fragment, useState } from 'react';
import {
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown
} from 'reactstrap';
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import LanguageSelector from '../components/LanguageSelector'
import Logout from './auth/Logout';

function AppNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const user = useSelector(state => state.auth.user)

    const { t } = useTranslation('AppNavbar')

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const adminLinks = (
        <Fragment>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>{t('admin')}</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <NavLink to="/advisories" activeClassName="active">{t('advisories')}</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                        <NavLink to="/districts" activeClassName="active">{t('districts')}</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                        <NavLink to="/organizations" activeClassName="active">{t('organizations')}</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                        <NavLink to="/places" activeClassName="active">{t('places')}</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                        <NavLink to="/users" activeClassName="active">{t('users')}</NavLink>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </Fragment>
    )

    const authLinks = (
        <Fragment>
            { user && user.roles.includes('admin') ? adminLinks : '' }
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    {user ? t('welcome',{name: user.firstName}) : ''}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem>
                        <NavLink to="/profile" activeClassName="active">
                            {t('user:profile')}
                        </NavLink>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
                <NavLink to="/" className="nav-link" activeClassName="active">{t('home')}</NavLink>
            </NavItem>
            <NavItem>
                <Logout/>
            </NavItem>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <NavItem>
                <NavLink to="/register" className="nav-link" activeClassName="active">{t('register')}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink to="/login" className="nav-link" activeClassName="active">{t('login')}</NavLink>
            </NavItem>
        </Fragment>
    );

    return <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
                <NavbarBrand href="/">{t('brand')}</NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <LanguageSelector />
                        { isAuthenticated ? authLinks : guestLinks }
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    </div>
}

export default AppNavbar