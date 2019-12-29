import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

function LoginModal() {
    const [modal, setModal] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState(null)

    const error = useSelector(state => state.error)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
 
    const dispatch = useDispatch()
    
    const toggle = () => {
        dispatch(clearErrors())
        setModal(!modal)
    }
    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const user = {
            email,
            password
        }
        dispatch(clearErrors())
        dispatch(login(user))
    }

   useEffect(() => {
        if (error.id === 'LOGIN_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    },[error])

    useEffect(() => {
        if (modal) {
            if (isAuthenticated) {
                toggle()
            }
        }
    },[modal,isAuthenticated])

    return <div>
        <NavLink onClick={toggle} href="#">
            Login
        </NavLink>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader
                toggle={toggle}
            >Login</ModalHeader>
            {msg ? <Alert color="danger">{msg}</Alert> : null }
            <ModalBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
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
                        >Login</Button>
                    </FormGroup>
                </Form>
            </ModalBody>
        </Modal>
    </div>
}

LoginModal.propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
}

export default LoginModal;