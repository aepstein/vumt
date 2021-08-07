import React from 'react';
import {
    Button,
    ButtonGroup,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useNavigateToPeer from '../../hooks/useNavigateToPeer'
import { mustBeWholeNumber, mustBeAtLeast } from '../../lib/validators'

export default function VisitDetailsEditor({
    visit,
    durationNights,
    setDurationNights,
    groupSize,
    setGroupSize,
    parkedVehicles,
    setParkedVehicles,
    startOn,
    onSubmit
}) {
    const { t } = useTranslation(['visit','place','translation','uom','error'])

    const { register, handleSubmit, errors } = useForm()

    const navigateToPeer = useNavigateToPeer('details')

    const goPrevious = () => {
        navigateToPeer('destinations')
    }
    const doSave = handleSubmit(onSubmit)
    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }

    return <div>
        <h2>{t('visit:visitDetails')}</h2>
        <Form>
            <FormGroup>
                <Label for="groupSize">{t('groupSize')}</Label>
                <Input
                    type="number"
                    id="groupSize"
                    name="groupSize"
                    value={groupSize}
                    onChange={onChange(setGroupSize)}
                    innerRef={register({required: true, min: 1, validate: {
                        mustBeWholeNumber
                    }})}
                    invalid={errors.groupSize ? true : false}
                />
                {errors.groupSize && errors.groupSize.type === 'required' &&
                    <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                {errors.groupSize && errors.groupSize.type === 'min' &&
                    <FormFeedback>{t('translation:mustBeAtLeast',{min: 1})}</FormFeedback>}
                {errors.groupSize && errors.groupSize.type === 'mustBeWholeNumber' &&
                    <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label for="parkedVehicles">{t('parkedVehicles')}</Label>
                <Input
                    type="number"
                    id="parkedVehicles"
                    name="parkedVehicles"
                    value={parkedVehicles}
                    onChange={onChange(setParkedVehicles)}
                    innerRef={register({required: true, min: 0, validate: {
                        min: mustBeAtLeast(0),
                        mustBeWholeNumber
                    }})}
                    invalid={errors.parkedVehicles ? true : false}
                />
                {errors.parkedVehicles && errors.parkedVehicles.type === 'required' &&
                    <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                {errors.parkedVehicles && errors.parkedVehicles.type === 'min' &&
                    <FormFeedback>{t('translation:mustBeAtLeast',{min: 0})}</FormFeedback>}
                {errors.parkedVehicles && errors.parkedVehicles.type === 'mustBeWholeNumber' &&
                    <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
            </FormGroup>
            <FormGroup>
                <Label for="durationNights">{t('durationNights')}</Label>
                <Input
                    type="number"
                    id="durationNights"
                    name="durationNights"
                    value={durationNights}
                    onChange={onChange(setDurationNights)}
                    innerRef={register({required: true, min: 0, validate: {
                        min: mustBeAtLeast(0),
                        mustBeWholeNumber
                    }})}
                    invalid={errors.durationNights ? true : false}
                />
                {errors.durationNights && errors.durationNights.type === 'required' &&
                    <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                {errors.durationNights && errors.durationNights.type === 'min' &&
                    <FormFeedback>{t('translation:mustBeAtLeast',{min: 0})}</FormFeedback>}
                {errors.durationNights && errors.durationNights.type === 'mustBeWholeNumber' &&
                    <FormFeedback>{t('translation:mustBeWholeNumber')}</FormFeedback>}
            </FormGroup>
            <ButtonGroup>
                <Button
                    color="secondary"
                    style={{marginTop: '2rem'}}
                    onClick={goPrevious}
                >{t('translation:previous')}</Button>
                <Button
                    color="primary"
                    style={{marginTop: '2rem'}}
                    onClick={doSave}
                >{visit._id ? t('editVisit') : t('addVisit')}</Button>
            </ButtonGroup>
        </Form>
    </div>
}
