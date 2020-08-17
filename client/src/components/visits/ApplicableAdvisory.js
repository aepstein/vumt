import React from 'react'
import {
    Card,
    CardBody,
    CardText,
    CardTitle
} from 'reactstrap'

export default function ApplicableAdvisory({advisory}) {
    return <Card>
        <CardBody>
            <CardTitle>{advisory.label}</CardTitle>
            <CardText>{advisory.prompt}</CardText>
        </CardBody>
    </Card>
}