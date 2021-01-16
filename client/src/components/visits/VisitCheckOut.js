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
import tz from 'timezone/loaded'

export default function VisitCheckOut({visit,onSave,saving}) {
    const { t } = useTranslation(['visit','translation'])

    const [ checkedOut, setCheckedOut ] = useState('')
    const [ timezone, setTimezone ] = useTimezone()
    const [ checkedOutDate, setCheckedOutDate, checkedOutTime, setCheckedOutTime
    ] = useZonedDateTime(timezone,visit.checkedOut,setCheckedOut)
    useEffect(() => {
        if (!visit.origin || !visit.origin.timezone) return
        setTimezone(visit.origin.timezone)
    },[visit.origin,setTimezone])
    const [ startOnRight, setStartOnRight ] = useState('')
    useEffect(() => {
        if (!visit.startOn || !visit.durationNights) setStartOnRight('')
        const newVal = new Date(visit.startOn)
        newVal.setDate(newVal.getDate() + visit.durationNights + 1)
        setStartOnRight(newVal)
    },[setStartOnRight,visit.startOn,visit.durationNights])
    useEffect(() => {
        if (!visit.checkedIn || !timezone || !tz) return
        const currentDate = new Date()
        if (currentDate > visit.checkedIn && currentDate < startOnRight) {
            setCheckedOutDate(tz(currentDate,timezone,'%Y-%m-%d'))
            setCheckedOutTime(tz(currentDate,timezone,'%H:%M'))
        }
    },[visit.startOn,timezone,setCheckedOutDate,setCheckedOutTime,visit.checkedIn,startOnRight])

    const { register, handleSubmit, errors } = useForm()
    
    const afterCheckIn = () => {
        if (!checkedOut || !visit.checkedIn) return true
        return checkedOut > visit.checkedIn
    }
    const beforeFuture = () => {
        if (!checkedOut) return true
        return checkedOut < Date.now()
    }
    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (saving) return
        const visitProps = {
            _id: visit._id,
            checkedOut
        }
        onSave(visitProps)
    }

    return <div>
        <Container>
            <h2>{t('checkOut')}</h2>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="checkedOutDate">{t('checkedOutDate')}</Label>
                    <Input
                        id="checkedOutDate"
                        name="checkedOutDate"
                        type="date"
                        value={checkedOutDate}
                        onChange={onChange(setCheckedOutDate)}
                        innerRef={register({
                            required: true,
                            validate: { afterCheckIn, beforeFuture }
                        })}
                        invalid={errors.checkedOutDate ? true : false}
                    />
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'afterCheckin' &&
                        <FormFeedback>{t('afterCheckIn')}</FormFeedback>}
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'beforeFuture' &&
                        <FormFeedback>{t('beforeFuture')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="checkedOutTime">{t('checkedOutTime')}</Label>
                    <Input
                        id="checkedOutTime"
                        name="checkedOutTime"
                        type="time"
                        value={checkedOutTime}
                        onChange={onChange(setCheckedOutTime)}
                        innerRef={register({required: true})}
                        invalid={errors.checkedOutTime ? true : false}
                    />
                    {errors.checkedOutTime && errors.checkedOutTime.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="dark"
                        block
                    >{t('checkOut')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
