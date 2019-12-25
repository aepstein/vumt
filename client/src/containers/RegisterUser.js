import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
    Button,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

function RegisterUser() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)

    const dispatch = useDispatch()
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ msg, setMsg ] = useState(null)

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            firstName,
            lastName,
            email,
            password
        }
        dispatch(clearErrors())
        dispatch(register(newUser))
    }

    useEffect(() => {
        if (error.id === 'REGISTER_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    }, [error] )

    return <div>
        { isAuthenticated ? <Redirect to="/" /> : null }
        <Container>
            <h2>Register</h2>
            {msg ? <Alert color="danger">{msg}</Alert> : null }
            <Form
                onSubmit={onSubmit}
            >
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        onChange={onChange(setFirstName)}
                        className="mb-3"
                    />
                    <Label for="lastName">Last Name</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        onChange={onChange(setLastName)}
                        className="mb-3"
                    />
                    <Label for="email">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="address@example.com"
                        onChange={onChange(setEmail)}
                        className="mb-3"
                    />
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={onChange(setPassword)}
                        className="mb-3"
                    />
                    <Button
                        color="dark"
                        style={{marginTop: '2rem'}}
                        block
                    >Register</Button>
                </FormGroup>
            </Form>
        </Container>
    </div>
}

RegisterUser.propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
}

export default RegisterUser;