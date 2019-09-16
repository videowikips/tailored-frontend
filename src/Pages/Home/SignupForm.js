import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message, Button } from 'semantic-ui-react';

import { signUp } from '../../actions/authentication';

export class SignupForm extends Component {
    state = {
        orgName: '',
        email: '',
        password: '',
        logo: null,
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        this.registerUser();
    }

    registerUser() {
        const { orgName, email, password, logo } = this.state;

        this.props.signUp({
            orgName,
            email,
            password,
            logo,
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

    onLogoChange = (event) => {
        const file = event.target.files[0];
        this.setState({ logo: file });
    }

    render() {
        return (
            <div>
                <form className="ui form" method="POST" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>
                            Organization Name
                        <span style={{ color: 'red' }}> *</span>


                        </label>
                        <input name="orgName" value={this.state.orgName} onChange={this.handleChange} />
                    </div>
                    <div className="field">
                        <label>Email
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>
                            Password
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>Logo</label>
                        <input name="logo" type="file" accept="image/*" onChange={this.onLogoChange} />
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

                    <Button type="submit" className="ui green button pull-right" loading={this.props.signupLoading} disabled={this.props.signupLoading}>Sign up</Button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    ...authentication
})

const mapDispatchToProps = (dispatch) => ({
    signUp: ({ orgName, email, password, logo }) => dispatch(signUp({ orgName, email, password, logo }))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SignupForm)
);