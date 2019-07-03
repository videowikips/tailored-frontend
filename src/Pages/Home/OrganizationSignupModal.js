import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

class OrganizationSignupModal extends Component {
    state = { 
        open: false 
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    openModel = () => {
        this.setState({
            open: true
        });
    }

    render = () => {
        return (
            <Modal
                open={this.props.open}
                onOpen={this.open}
                onClose={this.close}
                size='small'
            >
                <Modal.Header>Organization Sign up / Log in</Modal.Header>

                <Modal.Content>
                    <div>
                        <div className="ui segment">

                            <div className="ui very relaxed two column grid">

                                <div className="column">

                                    <h2>Sign up</h2>

                                    <form className="ui form">
                                        <div className="field">
                                            <label>Organization Name</label>
                                            <input />
                                        </div>
                                        <div className="field">
                                            <label>Email id</label>
                                            <input />
                                        </div>

                                        <div className="field">
                                            <label>Password</label>
                                            <input type="password" />
                                        </div>

                                        <button type="submit" className="ui green button">Sign up</button>
                                    </form>

                                </div>

                                <div className="column">

                                    <h2>Log in</h2>

                                    <form className="ui form">

                                        <div className="field">
                                            <label>Email id</label>
                                            <input />
                                        </div>

                                        <div className="field">
                                            <label>Password</label>
                                            <input type="password" />
                                        </div>

                                        <button type="submit" className="ui green button">Log in</button>
                                    </form>

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