import React from 'react';
import './Home.css';

export default class Home extends React.Component {

    render() {
        return (
            <div>
                <div className="cover">
                    <img src="/img/cover.jpg"></img>

                    <div className="cover-text">
                        <h1>Help non-profits make knowledge accessible in the last mile</h1>

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
                            <i aria-hidden="true" class="sign-out alternate massive icon"></i>
                            <div className="step-description">Sign up / Log in</div>
                        </div>

                        <div>
                            <div className="step-header">STEP 02</div>
                            <i aria-hidden="true" class="translate massive icon"></i>
                            <div className="step-description">
                                Translate text <br></br>
                                or add your voice over to videos <br></br>
                                in your local language
                            </div>
                        </div>

                        <div>
                            <div className="step-header">STEP 03</div>
                            <i aria-hidden="true" class="users massive icon"></i>
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