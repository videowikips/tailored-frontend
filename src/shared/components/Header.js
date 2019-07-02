import React from 'react';
import './Header.css';

export default class Header extends React.Component {

    render() {
        return (
            <div className="header-wrapper">
                <h2 class="ui header">
                    <img src="/img/logo.png" class="logo" />

                    <div className="pull-right">

                        <button class="large ui green button">
                            Non-profit <br></br>
                            Log in / Sign up
                        </button>

                        <button class="large ui blue button">
                            Volunteer <br></br>
                            Log in / Sign up
                        </button>

                    </div>
                </h2>
            </div>
        )
    }
}
