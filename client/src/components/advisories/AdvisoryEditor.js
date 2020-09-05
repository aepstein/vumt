import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
    AsyncTypeahead,
    Highlighter
} from 'react-bootstrap-typeahead'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import useValidationErrors from '../../hooks/useValidationErrors'
import useTimezone from '../../hooks/useTimezone'
import useZonedDateTime from '../../hooks/useZonedDateTime'

export default function AdvisoryEditor({advisory,onSave,saving}) {
    const { t } = useTranslation('advisory')
    const history = useHistory()

    const [ label, setLabel ] = useState('')
    useEffect(() => {
        setLabel(advisory.label)
    },[advisory.label,setLabel])
    const [ prompt, setPrompt ] = useState('')
    useEffect(() => {
        setPrompt(advisory.prompt)
    },[advisory.prompt,setPrompt])
    const [ startOn, setStartOn ] = useState('')
    const [ timezone ] = useTimezone()
    const [ startOnDate, setStartOnDate, startOnTime, setStartOnTime
    ] = useZonedDateTime(timezone,advisory.startOn,setStartOn)
    const [ endOn, setEndOn ] = useState('')
    const [ endOnDate, setEndOnDate, endOnTime, setEndOnTime
    ] = useZonedDateTime(timezone,advisory.endOn,setEndOn)
    const [ districts, setDistricts ] = useState([])
    useEffect(() => {
        if (!advisory.districts) {return}
        const vDistricts = advisory.districts.map((d) => {
            return {id: d._id, label: d.name}
        })
        setDistrictOptions(vDistricts)
        setDistricts(vDistricts)
    },[advisory.districts])
    const districtsRef = useRef()
    const [ districtOptions, setDistrictOptions ] = useState([])
    const [ districtLoading, setDistrictLoading ] = useState(false)
    const districtSearch = useCallback((query) => {
        setDistrictLoading(true)
        axios
            .get('/api/districts')
            .then((res) => {
                setDistrictOptions(res.data.map((district) => {
                    return {id: district._id, label: district.name}
                }))
                setDistrictLoading(false)
            })
    },[setDistrictLoading,setDistrictOptions])
    const initDistrictSearch = useCallback(() => {
        if (districtOptions.length > 0) return
        districtSearch()
    },[districtOptions,districtSearch])
    const renderDistricts = (option, props, index) => {
        return [
            <Highlighter key="label" search={props.text}>
                {option.label}
            </Highlighter>
        ]
    }

    const { register, handleSubmit, setError, clearError, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        clearError()
        if (startOn && endOn && startOn > endOn) {
            setError("startOnDate","afterEndOn",t('mustBeBeforeEndOn'))
            return
        }
        const newAdvisory = {
            _id: advisory._id,
            label,
            prompt,
            startOn,
            endOn,
            districts: districts.map((d) => {
                return {
                    "_id": d.id
                }
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
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="prompt">{t('prompt')}</Label>
                    <Input
                        type="text"
                        name="prompt"
                        id="prompt"
                        placeholder={t('prompt')}
                        innerRef={register({required: true})}
                        value={prompt}
                        onChange={onChange(setPrompt)}
                        invalid={errors.prompt ? true : false}
                    />
                    {errors.prompt && errors.prompt.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
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
                        innerRef={register({required: true})}
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
                        innerRef={register({required: true})}
                        invalid={errors.endOnTime ? true : false}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="districts">{t('districts')}</Label>
                    <AsyncTypeahead
                        id="districts"
                        name="districts"
                        multiple
                        selected={districts}
                        placeholder={t('districtsPlaceholder')}
                        options={districtOptions}
                        isLoading={districtLoading}
                        onSearch={districtSearch}
                        onChange={(selected) => setDistricts(selected)}
                        onFocus={initDistrictSearch}
                        renderMenuItemChildren={renderDistricts}
                        ref={districtsRef}
                        delay={200}
                        minLength={0}
                        clearButton={true}
                    />
                </FormGroup>
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{advisory._id ? t('updateAdvisory') : t('addAdvisory')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('commonForms:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
