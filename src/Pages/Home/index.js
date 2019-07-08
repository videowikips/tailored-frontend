import React from 'react';
import OrganizationSignupModal from './OrganizationSignupModal';

export default class Home extends React.Component {
    onOrganizationSignup = () => {
        this.setState({
            isOrganizationSignupOpen: true
        });
    }

    render() {
        return (
            <div className="home">

                <div className="header-wrapper">
                    <h2 className="ui header">
                        <img src="/img/logo.png" className="logo" alt="Video Wiki Logo" />

                        <div className="pull-right">
                            <OrganizationSignupModal/>

                            <button className="large ui blue button">
                                Volunteer <br></br>
                                Log in / Sign up
                            </button>

                        </div>
                    </h2>
                </div>

                <div className="cover">
                    <img src="/img/cover.jpg" alt="Video Wiki Cover" ></img>

                    <div className="cover-text">
                        <h1>Help non-profits make knowledge accessible @ the last mile</h1>

                        <div className="center description">
                            <div>
                                Translate text in local languages
                            </div>

                            <div>
                                Add Voice Overs in local languages
                            </div>
                        </div>

                    </div>
                </div>

                <div className="how-to">
                    <h2>How can you make an impact ?</h2>

                    <div className="row-3 steps">
                        <div>
                            <div className="step-header">STEP 01</div>
                            <i aria-hidden="true" className="sign-out alternate massive icon"></i>
                            <div className="step-description">Sign up / Log in</div>
                        </div>

                        <div>
                            <div className="step-header">STEP 02</div>
                            <i aria-hidden="true" className="translate massive icon"></i>
                            <div className="step-description">
                                Translate text <br></br>
                                or add your voice over to videos <br></br>
                                in your local language
                            </div>
                        </div>

                        <div>
                            <div className="step-header">STEP 03</div>
                            <i aria-hidden="true" className="users massive icon"></i>
                            <div className="step-description">
                                Make an impact on millions of people <br></br>
                                as non-profits will make the translated <br></br>
                                video available to who need the most
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}