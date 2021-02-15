import {
    Button,
    Input,
    FormFeedback,
    FormGroup,
    FormText,
    Label
} from 'reactstrap'
import { Trans, useTranslation } from 'react-i18next'
import locales from '../../locales'

export default function TranslationEditor ({register,name,translation,index,removeTranslation,updateTranslation,errors}) {
    const { t } = useTranslation('translation')
    return <FormGroup>
        <Label for={`${name}[${index}].translation`}>{locales.find((locale) => {
            return locale.code === translation.language
        }).name}</Label>
        <Input
            type="textarea"
            name={`${name}[${index}].translation`}
            placeholder={t('translation:translation')}
            innerRef={register({required: true})}
            value={translation.translation}
            onChange={updateTranslation('translation')}
            invalid={
                errors && 
                errors.translation ? true : false}
        />
        <FormText>
            <Trans i18nKey="translation:asciidocHint">You can use <a target="_blank" rel="noreferrer"
            href="https://docs.asciidoctor.org/asciidoc/latest/syntax-quick-reference/">Asciidoctor</a>
            markup to format your text.</Trans>
        </FormText>
        <Button
            color="danger"
            onClick={removeTranslation()}
        >{t('removeTranslation')}</Button>
        {
            errors &&
            errors.translation &&
            errors.translation.type === 'required' &&
            <FormFeedback>{t('translation:invalidRequired')}</FormFeedback>}
    </FormGroup>
}