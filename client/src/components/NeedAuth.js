import React from 'react'
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next'
import ApplicableAdvisories from '../containers/advisories/ApplicableAdvisories'

function NeedAuth() {
  const { t } = useTranslation()
  return <div className="NeedAuth">
      <Container>
        <p>{t('mustBeLoggedIn')}</p>
        <ApplicableAdvisories context="unauthenticated" />
      </Container>
  </div>
}

export default NeedAuth
