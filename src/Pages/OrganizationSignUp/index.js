import React from 'react';

export default class OrganizationSignUp extends React.Component {
    render() {
        return (
            <div>
                <div class="ui segment">

                    <div class="ui very relaxed two column grid">

                        <div class="column">

                            <h2>Sign up</h2>

                            <form class="ui form">
                                <div class="field">
                                    <label>Organization Name</label>
                                    <input />
                                </div>
                                <div class="field">
                                    <label>Email id</label>
                                    <input />
                                </div>

                                <div class="field">
                                    <label>Password</label>
                                    <input type="password" />
                                </div>

                                <button type="submit" class="ui button primary">Sign up</button>
                            </form>

                        </div>

                        <div class="column">

                            <h2>Log in</h2>

                            <form class="ui form">

                                <div class="field">
                                    <label>Email id</label>
                                    <input />
                                </div>

                                <div class="field">
                                    <label>Password</label>
                                    <input type="password" />
                                </div>

                                <button type="submit" class="ui button primary">Log in</button>
                            </form>

                        </div>


                    </div>
                    <div class="ui vertical divider">OR</div>
                </div>
            </div>
        )
    }
}