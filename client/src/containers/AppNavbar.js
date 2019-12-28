import React, { Fragment, useState, useEffect } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container
} from 'reactstrap';
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';
import { loadUser } from '../actions/authActions';

function AppNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const user = useSelector(state => state.auth.user)

    const dispatch = useDispatch()

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const authLinks = (
        <Fragment>
            <NavItem>
                <span className="navbar-text mr-3">
                    <strong>{user ? `Welcome, ${user.firstName}` : ''}</strong>
                </span>
            </NavItem>
            <NavItem>
                <NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink>
            </NavItem>
            <NavItem>
                <Logout/>
            </NavItem>
        </Fragment>
    );

    const guestLinks = (
        <Fragment>
            <NavItem>
                <NavLink to="/register" className="nav-link" activeClassName="active">Register</NavLink>
            </NavItem>
            <NavItem>
                <LoginModal />
            </NavItem>
        </Fragment>
    );

    useEffect(() => {
        dispatch(loadUser())
    },[user])

    return <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
                <NavbarBrand href="/">Visitor Use Management Tool</NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        { isAuthenticated ? authLinks : guestLinks }
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    </div>
}

AppNavbar.propTypes = {
    auth: PropTypes.object.isRequired
}

export default AppNavbar