import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

class LoginModal extends Component {
    render = () => {
        return (
            <Modal
                trigger={
                    <button className="large ui default button">
                        Log in
                    </button>
                }
                size='tiny'
            >
                <Modal.Header>Login</Modal.Header>

                <Modal.Content>
                    <div>
                        <div className="ui segment">

                            <div className="ui very relaxed one column grid">

                                {/* <div className="column">
                                    <SignupForm/>
                                </div> */}

                                <div className="column">
                                    <LoginForm />
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}
export default LoginModal;