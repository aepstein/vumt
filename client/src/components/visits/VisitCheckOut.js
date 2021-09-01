import React, { useCallback, useState, useMemo } from 'react';
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

export default function VisitCheckOut({visit,onSave,saving}) {
    const { t } = useTranslation(['visit','translation'])

    const defaultCheckOut = useMemo(() => {
        const intended = new Date(visit.startOn)
        const lateAfter = new Date(intended)
        lateAfter.setHours(intended.getHours()+24*(1+visit.durationNights))
        return (new Date()) > lateAfter ? intended : new Date()
    },[visit.startOn,visit.durationNights])

    const [ checkedOut, setCheckedOut ] = useState(defaultCheckOut)
    const [ timezone ] = useTimezone(visit.origin.timezone)
    const [ checkedOutDate, setCheckedOutDate, checkedOutTime, setCheckedOutTime
    ] = useZonedDateTime(timezone,checkedOut,setCheckedOut)

    const { register, handleSubmit, errors } = useForm()
    
    const afterCheckIn = useCallback(() => {
        if (!checkedOut || !visit.checkedIn) return true
        return checkedOut > visit.checkedIn
    },[checkedOut,visit.checkedIn])
    const beforeFuture = useCallback(() => {
        if (!checkedOut) return true
        return checkedOut < Date.now()
    },[checkedOut])
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
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'required' ?
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback> : ""}
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'afterCheckIn' ?
                        <FormFeedback>{t('afterCheckIn')}</FormFeedback> : ""}
                    {errors.checkedOutDate && errors.checkedOutDate.type === 'beforeFuture' ?
                        <FormFeedback>{t('beforeFuture')}</FormFeedback> : ""}
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
                <ApplicableAdvisories visit={visit} context="checkout" />
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
