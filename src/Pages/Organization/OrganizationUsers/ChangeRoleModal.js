import React, { Component } from 'react';
import { Button, Modal, Form, Select, Icon, Message } from 'semantic-ui-react'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { editPermissions } from '../../../actions/organization';

class ChangeRoleModal extends Component {
    state = {
        open: false,
        role: null,
        permissionUpdateMessage: null
    }

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
            text: 'Translate'
        }, {
            key: 'l2',
            value: 'l2',
            text: 'Edit and Update'
        }, {
            key: 'l3',
            value: 'l3',
            text: 'Edit, Update and Translate'
        }
    ]

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

    componentWillReceiveProps(nextProps) {
        if (this.props.permissionUpdateMessage !== nextProps.permissionUpdateMessage) {
            this.setState({
                permissionUpdateMessage: nextProps.permissionUpdateMessage
            });
        }
    }

    onFormSubmit = () => {
        const { role } = this.state;
        let permissions;

        if (role === 'l0') {
            permissions = ['admin']
        }else if (role === 'l1') {
            permissions = ['translate'];
        } else if (role === 'l2') {
            permissions = ['edit', 'update'];
        } else if (role === 'l3') {
            permissions = ['edit', 'update', 'translate'];
        }

        this.props.editPermissions({
            email: this.props.email,
            permissions
        });
    }

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

                    {
                        this.state.permissionUpdateMessage && 
                        
                        <Message color='green'>
                            {this.state.permissionUpdateMessage}
                        </Message>
                    }
                    

                </Modal.Content>

                <Modal.Actions>
                    <Button positive type="submit" onClick={this.onFormSubmit}>Change</Button>
                    <Button onClick={this.close}> Cancel </Button>
                </Modal.Actions>

            </Modal>
        );
    }
}

const mapStateToProps = ({ organization }) => ({
    ...organization
})

const mapDispatchToProps = (dispatch) => ({
    editPermissions: ({ email, permissions }) => dispatch(editPermissions({ email, permissions }))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ChangeRoleModal)
);