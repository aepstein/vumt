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
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useValidationErrors from '../../hooks/useValidationErrors'
import TranslationsEditor from '../translations/TranslationsEditor'
import colors from '../../lib/colors'

export default function ThemeEditor({theme,onSave,saving}) {
    const { t } = useTranslation(['theme','translation'])
    const history = useHistory()

    const [ name, setName ] = useState(theme.name)
    useEffect(() => {
        setName(theme.name)
    },[theme.name,setName])
    const [ color, setColor ] = useState(theme.color)
    useEffect(() => {
        setColor(theme.color)
    },[theme.color,setColor])
    const [ labels, setLabels ] = useState(theme.labels)
    useEffect(() => {
        setLabels(theme.labels)
    },[theme.labels,setLabels])

    const { register, handleSubmit, setError, clearErrors, errors } = useForm()

    const onChange = (setter) => (e) => {
        const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value
        setter(value)
    }
    const onSubmit = () => {
        if (saving) return
        clearErrors()
        const newTheme = {
            _id: theme._id,
            name,
            color,
            labels
        }
        onSave(newTheme)
    }

    useValidationErrors({setError})

    return <div>
        <Container>
            <h1>{theme._id ? t('editTheme') : t('newTheme')}</h1>
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="name">{t('translation:name')}</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={t('translation:name')}
                        innerRef={register({required: true})}
                        value={name}
                        onChange={onChange(setName)}
                        invalid={errors.name ? true : false}
                    />
                    {errors.name && errors.name.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="color">{t('color')}</Label>
                    <Input
                        type="select"
                        name="color"
                        id="color"
                        placeholder={t('color')}
                        innerRef={register({required: true})}
                        value={color}
                        onChange={onChange(setColor)}
                        invalid={errors.color ? true : false}
                    >
                        {colors.map((color) => {
                            return <option key={color}>{color}</option>
                        })}
                    </Input>
                    {errors.color && errors.color.type === 'required' &&
                        <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <h2>{t('labels')}</h2>
                <TranslationsEditor register={register} errors={errors} name="labels"
                    translations={labels} setTranslations={setLabels} />
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{theme._id ? t('updateTheme') : t('addTheme')}</Button>
                    <Button color="secondary"
                        onClick={() => history.goBack()}
                    >{t('translation:cancel')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}
