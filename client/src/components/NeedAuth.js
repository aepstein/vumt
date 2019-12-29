import React from 'react'
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next'

function NeedAuth() {
  const { t } = useTranslation()
  return <div className="NeedAuth">
      <Container>
        <p>{t('mustBeLoggedIn')}</p>
      </Container>
  </div>
}

export default NeedAuth
