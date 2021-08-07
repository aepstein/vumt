import React from 'react';
import {
    Button,
    ButtonGroup,
    Form
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useNavigateToPeer from '../../hooks/useNavigateToPeer'
import DestinationsSelect from '../places/DestinationsSelect'

export default function VisitEditor({origin,startOn,destinations,setDestinations}) {
    const { t } = useTranslation(['visit','place','translation','uom','error'])

    const { register, handleSubmit, setError, errors } = useForm()

    const navigateToPeer = useNavigateToPeer('destinations')

    const goPrevious = () => {
        navigateToPeer('departure')
    }
    const onSubmit = async (e) => {
        if (destinations.length === 0) {
            setError("destinations",{type: "required", message: t('translation:invalidRequired')})
            return
        }
        navigateToPeer('details')
    }

    return <div>
        <h3>{t('destinations')}</h3>
        <Form
            onSubmit={handleSubmit(onSubmit)}
        >
            <DestinationsSelect
                destinations={destinations}
                label={t('destinations')}
                name="destinations"
                origin={origin}
                startOn={startOn}
                setDestinations={setDestinations}
            />
            <ButtonGroup>
                <Button
                    color="secondary"
                    style={{marginTop: '2rem'}}
                    onClick={goPrevious}
                >{t('translation:previous')}</Button>
                <Button
                    color="primary"
                    style={{marginTop: '2rem'}}
                    block
                >{t('translation:next')}</Button>
            </ButtonGroup>
        </Form>
    </div>
}
