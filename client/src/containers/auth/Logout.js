import React from 'react';
import {
    NavLink
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { logout } from '../../actions/authActions';

function Logout() {
    const dispatch = useDispatch()
    const { t } = useTranslation(['translation'])

    return <div>
        <NavLink onClick={() => dispatch(logout)} href="#">
            {t('logout')}
        </NavLink>
    </div>
}

export default Logout