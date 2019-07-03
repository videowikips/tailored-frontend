import React, { Component } from 'react'
import { Button, Modal, Form, Select } from 'semantic-ui-react'

class ModalExampleSize extends Component {
    state = { open: true }

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

    show = size => () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open } = this.state

        return (
            <div>
                <Modal size="small" open={open} onClose={this.close}>
                    <Modal.Header className="invite-modal-header">Invite New User</Modal.Header>

                    <Modal.Content>
                        <Form>

                            <Form.Field>
                                <label>Email</label>
                                <input />
                            </Form.Field>

                            <Form.Group widths='equal'>
                                <Form.Input fluid label='First name'/>
                                <Form.Input fluid label='Last name'/>
                            </Form.Group>

                            <Form.Field>
                                <label>Role</label>
                                <Select options={this.roles} />
                            </Form.Field>
                        </Form>

                    </Modal.Content>

                    <Modal.Actions>
                        <Button positive>Invite User</Button>
                        <Button> Cancel </Button>
                    </Modal.Actions>

                </Modal>
            </div>
        )
    }
}

export default ModalExampleSize