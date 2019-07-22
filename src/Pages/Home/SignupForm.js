import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';

import { signUp } from '../../actions/authentication';

export class SignupForm extends Component {
    state = {
        orgName: '',
        email: '',
        password: ''
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        this.registerUser();
    }

    registerUser() {
        const { orgName, email, password } = this.state;

        this.props.signUp({
            orgName,
            email,
            password
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <h2>Sign up</h2>

                <form className="ui form" method="POST" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>Organization Name</label>
                        <input name="orgName" value={this.state.orgName} onChange={this.handleChange} />
                    </div>
                    <div className="field">
                        <label>Email id</label>
                        <input name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>Password</label>
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    {
                        this.props.signUpMessage ? (
                            this.props.signUpSuccess ?
                                (
                                    <Message color='green'>
                                        {this.props.signUpMessage}
                                    </Message>
                                ) :
                                (
                                    <Message color='red'>
                                        {this.props.signUpMessage}
                                    </Message>
                                )

                        ) : null
                    }

                    <button type="submit" className="ui green button">Sign up</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    ...authentication
})

const mapDispatchToProps = (dispatch) => ({
    signUp: ({ orgName, email, password }) => dispatch(signUp({ orgName, email, password }))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SignupForm)
);