import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

class RegisterUser extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        msg: null
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') {
                this.setState({msg: error.msg.msg});
            } else {
                this.setState({msg: null});
            }
        }
        if (isAuthenticated) {
            this.closeSuccessfully();
        }
    }

    closeSuccessfully = () => {
        this.props.clearErrors();
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            email,
            password } = this.state;
        const newUser = {
            firstName,
            lastName,
            email,
            password
        }
        this.props.register(newUser);
    }
    render() {
        return(
            <div>
                { this.props.isAuthenticated ? <Redirect to="/" /> : null }
                <Container>
                    <h2>Register</h2>
                    {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
                    <Form
                        onSubmit={this.onSubmit}
                    >
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="First Name"
                                onChange={this.onChange}
                                className="mb-3"
                            />
                            <Label for="lastName">Last Name</Label>
                            <Input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Last Name"
                                onChange={this.onChange}
                                className="mb-3"
                            />
                            <Label for="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="address@example.com"
                                onChange={this.onChange}
                                className="mb-3"
                            />
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                onChange={this.onChange}
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
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
})

export default connect(
    mapStateToProps,
    {
        register,
        clearErrors
    }
)(RegisterUser);