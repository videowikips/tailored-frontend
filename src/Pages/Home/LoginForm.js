import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'semantic-ui-react';

import { login } from '../../actions/authentication';

class LoginForm extends Component {
    state = {
        email: '',
        password: '',

        message: ''
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        
        // resetting the error message
        this.setState({
            message: ''
        });

        const { email, password } = this.state;
        this.props.login({ email, password });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        if (nextProps.isAuthenticated) {
            this.props.history.push('/organization/users');
        }

        if (nextProps.errorMessage) {
            this.setState({
                email: '',
                password: '',
                message: nextProps.errorMessage
            });
        }
    }

    render() {
        return (
            <div>
                <h2>Log in</h2>

                <form className="ui form" method="POST" onSubmit={this.onFormSubmit}>

                    <div className="field">
                        <label>Email id</label>
                        <input name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    {
                        this.state.message ? (
                            <Message color='red'>
                                Invalid Email or Password
                            </Message>
                        ): null
                    }

                    <button type="submit" className="ui green button">Log in</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    ...authentication
})

const mapDispatchToProps = (dispatch) => ({
    login: ({email, password}) => dispatch(login({email, password}))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(LoginForm)
);