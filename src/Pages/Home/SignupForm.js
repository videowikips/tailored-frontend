import React, { Component } from 'react';
import axios from 'axios';

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

    async registerUser() {
        const { orgName, email, password } = this.state;
        
        const res = await axios.post('http://localhost:4000/api/auth/register', {
            orgName,
            email,
            password
        });

        console.log(res);
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

                <form className="ui form"  method="POST" onSubmit={this.onFormSubmit}>
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

                    <button type="submit" className="ui green button">Sign up</button>
                </form>
            </div>
        )
    }
}

export default SignupForm;