import React from 'react'
import {
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import ApplicableAdvisory from './ApplicableAdvisory'
import useTranslations from '../../hooks/useTranslations'

export default function ApplicableTheme({theme}) {
    const label = useTranslations({fallback: theme.name, translations: theme.labels})
    return <Card className={`bg-${theme.color}`}>
        <CardBody>
            <CardTitle>{label}</CardTitle>
            {theme.advisories.map((advisory) => {
                return <ApplicableAdvisory advisory={advisory} key={advisory._id} />
            })}
        </CardBody>
    </Card>
}