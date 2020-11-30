import React from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { resetPasswordContinue } from '../../actions/authActions';
import { useTranslation } from 'react-i18next'

function ResetPasswordComplete() {
    const resetPasswordComplete = useSelector((state) => state.auth.resetPasswordComplete)
    const dispatch = useDispatch()
    const { t } = useTranslation('AppNavbar')

    const onComplete = (e) => {
        e.preventDefault()
        dispatch(resetPasswordContinue)
    }

    return <Modal isOpen={resetPasswordComplete}>
        <ModalHeader>{t('resetPasswordComplete')}</ModalHeader>
        <ModalBody>{t('resetPasswordCompleteMessage')}</ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={onComplete}>{t('continue')}</Button>
        </ModalFooter>
    </Modal>
}

export default ResetPasswordComplete