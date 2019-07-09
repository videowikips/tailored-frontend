import React, { Component } from 'react';
import { Button, Modal, Form, Select, Icon } from 'semantic-ui-react'

class ChangeRoleModal extends Component {
    state = {
        open: false
    }

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

    render() {
        const { open } = this.state;

        return (
            <Modal
                trigger={
                    <Button onClick={this.open} icon>
                        <Icon name='edit' />
                    </Button>
                }
                open={open}
                closeOnEscape={true}
                closeOnDimmerClick={true}
                onClose={this.close}
                size="small"
            >

                <Modal.Header className="invite-modal-header">Change User Role</Modal.Header>

                <Modal.Content>

                    <Form onSubmit={this.onFormSubmit}>
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
        );
    }
}

export default ChangeRoleModal;