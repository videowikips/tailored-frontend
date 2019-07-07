import React, { Component } from 'react';

class LoginForm extends Component {
    state = {
        email: '',
        password: ''
    }

    onFormSubmit = (e) => {
        e.preventDefault();
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

                    <button type="submit" className="ui green button">Log in</button>
                </form>
            </div>
        )
    }
}

export default LoginForm;