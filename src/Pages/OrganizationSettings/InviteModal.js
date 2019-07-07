import React, { Component } from 'react'
import { Button, Modal, Form, Select, Icon } from 'semantic-ui-react'

class ModalExampleSize extends Component {
    state = {
        // modal state
        open: false,

        // invite form values
        email: '',
        firstName: '',
        lastName: '',
        role: ''
    }

    form = null;

    close = () => this.setState({ open: false });

    open = () => this.setState({ open: true });

    roles = [
        {
            key: 'admin',
            value: 'admin',
            text: 'Admin'
        }, {
            key: 'user',
            value: 'user',
            text: 'User'
        }, {
            key: 'guest',
            value: 'guest',
            text: 'Guest'
        }
    ]

    onFormSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }

    handleChange = (event, data) => {
        if (data) {
            const value = data.value;
            const name = data.name;

            console.log(value, name);

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
                                <Form.Input name="firstName" onChange={this.handleChange} value={this.state.firstName} fluid label='First name' />
                                <Form.Input name="lastName" onChange={this.handleChange} value={this.state.lastName} fluid label='Last name' />
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

export default ModalExampleSize