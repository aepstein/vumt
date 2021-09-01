import React from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useZonedDateTime from '../../hooks/useZonedDateTime'
import OriginSelect from '../places/OriginSelect'
import useNavigateToPeer from '../../hooks/useNavigateToPeer'

export default function VisitDepartureEditor({origin,setOrigin,startOn,setStartOn,timezone}) {
    const { t } = useTranslation(['visit','place','translation','uom','error'])
    const navigateToPeer = useNavigateToPeer('departure')

    const [ startOnDate, setStartOnDate, startOnTime, setStartOnTime
    ] = useZonedDateTime(timezone,startOn,setStartOn)

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = async (e) => {
        if (!origin) {
            setError("origin",{type: "required", message: t('translation:invalidRequired')})
            return
        }
        navigateToPeer('destinations')
    }

    return <div>
        <Container>
            <h3>{t('departureDetail')}</h3>
            <p>{t('translation:timesAreLocal',{timezone})}</p>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="startOnDate">{t('startOnDate')}</Label>
                    <Input
                        id="startOnDate"
                        name="startOnDate"
                        type="date"
                        value={startOnDate}
                        onChange={onChange(setStartOnDate)}
                        innerRef={register({required: true})}
                        invalid={errors.startOnDate ? true : false}
                    />
                    {errors.startOnDate && errors.startOnDate.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="startOnTime">{t('startOnTime')}</Label>
                    <Input
                        id="startOnTime"
                        name="startOnTime"
                        type="time"
                        value={startOnTime}
                        onChange={onChange(setStartOnTime)}
                        innerRef={register({required: true})}
                        invalid={errors.startOnTime ? true : false}
                    />
                    {errors.startOnTime && errors.startOnTime.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <OriginSelect
                    errors={errors.origin}
                    origin={origin}
                    label={t('origin')}
                    name="origin"
                    setOrigin={setOrigin}
                    startOn={startOn}
                />
                <ButtonGroup>
                    <Button
                        color="primary"
                        style={{marginTop: '2rem'}}
                        block
                    >{t('translation:next')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
