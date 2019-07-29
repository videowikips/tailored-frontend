import React, { Component } from 'react'
import { Button, Modal, Form, Select, Icon, Message } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { inviteUser } from '../../../actions/organization';

class ModalExampleSize extends Component {
    state = {
        // modal state
        open: false,

        // invite form values
        email: '',
        firstname: '',
        lastname: '',
        role: '',

        errorMessage: null
    }

    form = null;

    close = () => this.setState({ open: false });

    open = () => this.setState({ open: true });

    roles = [
        {
            key: 'l0',
            value: 'l0',
            text: 'Admin',
        },
        {
            key: 'l1',
            value: 'l1',
            text: 'Review'
        }, {
            key: 'l2',
            value: 'l2',
            text: 'Translate'
        }, {
            key: 'l3',
            value: 'l3',
            text: 'Review and Translate'
        }
    ]

    onFormSubmit = (e) => {
        e.preventDefault();

        const { email, firstname, lastname, role } = this.state;
        let permissions;
        if (role === 'l0') {
            permissions = ['admin'];
        }
        else if (role === 'l1') {
            permissions = ['review'];
        } else if (role === 'l2') {
            permissions = ['translate'];
        } else if (role === 'l3') {
            permissions = ['review', 'translate'];
        }

        this.props.inviteUser({
            email,
            firstname,
            lastname,
            permissions
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.inviteUserSuccess) {
            this.close();
        } else {
            if (nextProps.inviteUserMessage) {
                this.setState({
                    errorMessage: nextProps.inviteUserMessage
                });
            }
        }
    }

    handleChange = (event, data) => {
        if (data) {
            const value = data.value;
            const name = data.name;

            this.setState({
                [name]: value
            });
        } else {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({
                [name]: value
            });
        }
    }

    render() {
        const { open } = this.state

        return (
            <div>
                <Modal
                    trigger={
                        <Button icon primary labelPosition='left' onClick={this.open}>
                            <Icon name='plus' />
                            Invite New User
                        </Button>
                    }
                    open={open}
                    closeOnEscape={true}
                    closeOnDimmerClick={true}
                    onClose={this.close}
                    size="small"
                >

                    <Modal.Header className="invite-modal-header">Invite New User</Modal.Header>

                    <Modal.Content>

                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Field>
                                <label>Email</label>
                                <input name="email" onChange={this.handleChange} value={this.state.email} />
                            </Form.Field>

                            <Form.Group widths='equal'>
                                <Form.Input name="firstname" onChange={this.handleChange} value={this.state.firstname} fluid label='First name' />
                                <Form.Input name="lastname" onChange={this.handleChange} value={this.state.lastname} fluid label='Last name' />
                            </Form.Group>

                            <Form.Field>
                                <label>Role</label>
                                <Select
                                    name="role"
                                    onChange={this.handleChange}
                                    value={this.state.role}
                                    options={this.roles} />
                            </Form.Field>
                        </Form>

                        {
                            this.state.errorMessage &&

                            <Message color='red'>
                                {this.state.errorMessage}
                            </Message>
                        }

                    </Modal.Content>

                    <Modal.Actions>
                        <Button positive type="submit" onClick={this.onFormSubmit}>Invite User</Button>
                        <Button onClick={this.close}> Cancel </Button>
                    </Modal.Actions>

                </Modal>
            </div>
        )
    }
}

const mapStateToProps = ({ organization }) => ({
    ...organization
})

const mapDispatchToProps = (dispatch) => ({
    inviteUser: ({ email, firstname, lastname, permissions }) => dispatch(inviteUser({ email, firstname, lastname, permissions }))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ModalExampleSize)
);