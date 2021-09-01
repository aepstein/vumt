import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Container,
    Input,
    Form,
    FormFeedback,
    FormGroup,
    Label
} from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'
import useTimezone from '../../hooks/useTimezone'
import useZonedDateTime from '../../hooks/useZonedDateTime'
import advisoryContexts from '../../lib/advisoryContexts'
import DistrictsSelect from '../districts/DistrictsSelect'
import ThemeSelect from '../themes/ThemeSelect'
import TranslationsEditor from '../translations/TranslationsEditor'

export default function AdvisoryEditor({advisory,onSave,saving}) {
    const { t } = useTranslation(['advisory','advisoryContext','translation'])
    const history = useHistory()

    const [ theme, setTheme ] = useState('')
    useEffect(() => {
        setTheme(advisory.theme)
    },[advisory.theme,setTheme])
    const [ label, setLabel ] = useState('')
    useEffect(() => {
        setLabel(advisory.label)
    },[advisory.label,setLabel])
    const [ startOn, setStartOn ] = useState(advisory.startOn)
    const [ timezone ] = useTimezone()
    const [ startOnDate, setStartOnDate, startOnTime, setStartOnTime
    ] = useZonedDateTime(timezone,startOn,setStartOn)
    const [ endOn, setEndOn ] = useState(advisory.endOn)
    const [ endOnDate, setEndOnDate, endOnTime, setEndOnTime
    ] = useZonedDateTime(timezone,endOn,setEndOn)
    const [ districts, setDistricts ] = useState([])
    useEffect(() => {
        if (!advisory.districts) {return}
        setDistricts(advisory.districts)
    },[advisory.districts,setDistricts])
    const [ contexts, setContexts ] = useState([])
    useEffect(() => {
        if (!advisory.contexts) { return }
        const vContexts = advisory.contexts.map((c) => {
            return {id: c, label: t(`advisoryContext:${c}`)}
        })
        setContexts(vContexts)
    },[advisory.contexts,t])
    const [contextOptions, setContextOptions] = useState(advisoryContexts.map(c => {
        return {id: c, label: t(`advisoryContext:${c}`)}
    }))
    useEffect(() => {
        setContextOptions(advisoryContexts.map(c => {
            return {id: c, label: t(`advisoryContext:${c}`)}
        }))
    }, [setContextOptions,t])
    const [prompts,setPrompts] = useState([])
    useEffect(() => {
        if (!advisory.prompts) {return}
        setPrompts(advisory.prompts)
    },[advisory.prompts])

    const { register, handleSubmit, setError, clearErrors, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        clearErrors()
        if (startOn && endOn && startOn > endOn) {
            setError("startOnDate",{type: "afterEndOn", message: t('mustBeBeforeEndOn')})
            return
        }
        if (!theme) {
            setError("theme",{type: "required"})
            return
        }
        const newAdvisory = {
            _id: advisory._id,
            theme,
            label,
            prompts,
            startOn,
            endOn,
            districts: districts.map(({_id}) => {
                return _id
            }),
            contexts: contexts.map((c) => {
                return c.id
            })
        }
        onSave(newAdvisory)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h1>{advisory._id ? t('editAdvisory') : t('newAdvisory')}</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <p>{t('translation:timesAreLocal',{timezone})}</p>
                <ThemeSelect theme={theme} setTheme={setTheme} register={register} errors={errors.theme} name="theme" />
                <FormGroup>
                    <Label for="label">{t('label')}</Label>
                    <Input
                        type="text"
                        name="label"
                        id="label"
                        placeholder={t('label')}
                        innerRef={register({required: true})}
                        value={label}
                        onChange={onChange(setLabel)}
                        invalid={errors.label ? true : false}
                    />
                    {errors.label && errors.label.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="startOnDate">{t('startOnDate')}</Label>
                    <Input
                        id="startOnDate"
                        name="startOnDate"
                        type="date"
                        value={startOnDate}
                        onChange={onChange(setStartOnDate)}
                        invalid={errors.startOnDate ? true : false}
                    />
                    {errors.startOnDate && errors.startOnDate.type === 'afterEndOn' &&
                        <FormFeedback>{t('mustBeBeforeEndOn')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="startOnTime">{t('startOnTime')}</Label>
                    <Input
                        id="startOnTime"
                        name="startOnTime"
                        type="time"
                        value={startOnTime}
                        onChange={onChange(setStartOnTime)}
                        innerRef={register()}
                        invalid={errors.startOnTime ? true : false}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="endOnDate">{t('endOnDate')}</Label>
                    <Input
                        id="endOnDate"
                        name="endOnDate"
                        type="date"
                        value={endOnDate}
                        onChange={onChange(setEndOnDate)}
                        invalid={errors.endOnDate ? true : false}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="endOnTime">{t('endOnTime')}</Label>
                    <Input
                        id="endOnTime"
                        name="endOnTime"
                        type="time"
                        value={endOnTime}
                        onChange={onChange(setEndOnTime)}
                        innerRef={register()}
                        invalid={errors.endOnTime ? true : false}
                    />
                </FormGroup>
                <DistrictsSelect districts={districts} setDistricts={setDistricts} />
                <FormGroup>
                    <Label for="contexts">{t('contexts')}</Label>
                    <Typeahead
                        id="contexts"
                        name="contexts"
                        multiple
                        selected={contexts}
                        placeholder={t('contextsPlaceholder')}
                        options={contextOptions}
                        onChange={(selected) => setContexts(selected)}
                        clearButton={true}
                    />
                </FormGroup>
                <h2>{t('prompts')}</h2>
                <TranslationsEditor register={register} errors={errors} name="prompts"
                    translations={prompts} setTranslations={setPrompts} />
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{advisory._id ? t('updateAdvisory') : t('addAdvisory')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('translation:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
