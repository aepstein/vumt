import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    Container,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addVisit } from '../actions/visitActions';

function NewVisit() {
    const error = useSelector( state => state.error )
    const visitSaving = useSelector( state => state.visit.visitSaving )

    const [ name, setName ] = useState('')
    const [ isSaving, setIsSaving ] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const newVisit = {
            name
        }
        setIsSaving(true)
        dispatch(addVisit(newVisit))
    }

    useEffect(() => {
        if (isSaving && !visitSaving && !error.id) {
            setIsSaving(true)
            history.push("/")
        }
    })

    return <div>
        <Container>
            <h2>Add visit</h2>
            <Form
                onSubmit={onSubmit}
            >
                <FormGroup>
                    <Label for="name">Visit</Label>
                    <Input
                        type="text"
                        name="name"
                        id="visit"
                        placeholder="Specify name"
                        onChange={onChange(setName)}
                    />
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >Add Visit</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
}

NewVisit.propTypes = {
    isAuthenticated: PropTypes.bool
}

export default NewVisit;