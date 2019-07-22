import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

class OrganizationSignupModal extends Component {
    render = () => {
        return (
            <Modal
                trigger={
                    <button className="large ui green button">
                        Non-profit <br></br>
                        Log in / Sign up
                    </button>
                }
                size='small'
            >
                <Modal.Header>Organization Sign up / Log in</Modal.Header>

                <Modal.Content>
                    <div>
                        <div className="ui segment">

                            <div className="ui very relaxed two column grid">

                                <div className="column">
                                    <SignupForm/>
                                </div>

                                <div className="column">
                                    <LoginForm />
                                </div>

                            </div>
                            <div className="ui vertical divider">OR</div>
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}
export default OrganizationSignupModal;