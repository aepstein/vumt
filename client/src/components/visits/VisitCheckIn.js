import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useTimezone from '../../hooks/useTimezone'
import useZonedDateTime from '../../hooks/useZonedDateTime'
import ApplicableAdvisories from '../../containers/advisories/ApplicableAdvisories'

export default function VisitCheckIn({visit,onSave,saving}) {
    const { t } = useTranslation(['visit','translation'])

    const defaultCheckIn = (startOn) => {
        const intended = new Date(startOn)
        const lateAfter = new Date(intended)
        lateAfter.setHours(intended.getHours()+24)
        return (new Date()) > lateAfter ? intended : new Date()
    }

    const [ checkedIn, setCheckedIn ] = useState(defaultCheckIn(visit.startOn))
    const [ timezone ] = useTimezone(visit.origin.timezone)
    const [ checkedInDate, setCheckedInDate, checkedInTime, setCheckedInTime
    ] = useZonedDateTime(timezone,checkedIn,setCheckedIn)
    const [ startOnLeft, setStartOnLeft ] = useState('')
    useEffect(() => {
        if (!visit.startOn) setStartOnLeft('')
        const newVal = new Date(visit.startOn)
        newVal.setHours(newVal.getHours() - 24)
        setStartOnLeft(newVal)
    },[setStartOnLeft,visit.startOn])
    const [ startOnRight, setStartOnRight ] = useState('')
    useEffect(() => {
        if (!visit.startOn || !visit.durationNights) setStartOnRight('')
        const newVal = new Date(visit.startOn)
        newVal.setDate(newVal.getDate() + visit.durationNights + 1)
        setStartOnRight(newVal)
    },[setStartOnRight,visit.startOn,visit.durationNights])


    const { register, handleSubmit, errors } = useForm()
    
    const afterLeft = () => {
        if (!checkedIn || !startOnLeft) return true
        return checkedIn > startOnLeft
    }
    const beforeRight = () => {
        if (!checkedIn || !startOnRight) return true
        return checkedIn < startOnRight
    }
    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (saving) return
        const visitProps = {
            _id: visit._id,
            checkedIn
        }
        onSave(visitProps)
    }

    return <div>
        <Container>
            <h2>{t('checkIn')}</h2>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="checkedInDate">{t('checkedInDate')}</Label>
                    <Input
                        id="checkedInDate"
                        name="checkedInDate"
                        type="date"
                        value={checkedInDate}
                        onChange={onChange(setCheckedInDate)}
                        innerRef={register({
                            required: true,
                            validate: { afterLeft, beforeRight }
                        })}
                        invalid={errors.checkedInDate ? true : false}
                    />
                    {errors.checkedInDate && errors.checkedInDate.type === 'required' ?
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback> : ""}
                    {errors.checkedInDate && errors.checkedInDate.type === 'afterLeft' ?
                        <FormFeedback>{t('afterLeft')}</FormFeedback> : ""}
                    {errors.checkedInDate && errors.checkedInDate.type === 'beforeRight' ?
                        <FormFeedback>{t('beforeRight')}</FormFeedback> : ""}
                </FormGroup>
                <FormGroup>
                    <Label for="checkedInTime">{t('checkedInTime')}</Label>
                    <Input
                        id="checkedInTime"
                        name="checkedInTime"
                        type="time"
                        value={checkedInTime}
                        onChange={onChange(setCheckedInTime)}
                        innerRef={register({required: true})}
                        invalid={errors.checkedInTime ? true : false}
                    />
                    {errors.checkedInTime && errors.checkedInTime.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <ApplicableAdvisories visit={visit} context="checkin" />
                <ButtonGroup>
                    <Button
                        color="dark"
                        block
                    >{t('checkIn')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
