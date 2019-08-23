import React, { Component } from 'react'
import { List, Select } from 'semantic-ui-react'
import DeleteUserModal from './DeleteUserModal';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchUsers, editPermissions } from '../../../actions/organization';

function getUserRoleValue(permissions) {
    let role = 'l1';
    if (permissions.length === 1) {
        if (permissions[0] === 'admin') {
            role = 'l0';
        } else if (permissions[0] === 'review') {
            role = 'l1';
        } else if (permissions[0] === 'translate') {
            role = 'l2'
        }
    } else {
        role = 'l3';
    }
    return role;
}

class UserTable extends Component {
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

    componentDidMount() {
        this.props.fetchUsers(this.props.organization._id)
    }

    onRoleChange = (role, user) => {
        let permissions;
        if (role === 'l0') {
            permissions = ['admin']
        } else if (role === 'l1') {
            permissions = ['review'];
        } else if (role === 'l2') {
            permissions = ['translate'];
        } else if (role === 'l3') {
            permissions = ['review', 'translate'];
        }
        this.props.editPermissions(this.props.organization._id, user._id, permissions);
    }

    render() {
        const userRole = this.props.user.organizationRoles.find(r => r.organization._id === this.props.organization._id);
        const canModify = userRole.organizationOwner || (userRole.permissions.indexOf('admin') !== -1);

        const template = this.props.users.length ? this.props.users.map((user) => {
            const isOrganizationOwner = user.organizationRoles[0].organizationOwner;

            return (
                <List.Item key={user.email}>

                    <List.Icon name='user' size='large' verticalAlign='middle' />

                    <List.Content>

                        <div>
                            <span className="invite-name bold-text">{user.firstname} {user.lastname}</span>  {user.email}

                            {!isOrganizationOwner && (
                                <div className="pull-right">
                                    <Select
                                        style={{ marginRight: 10 }}
                                        name="role"
                                        onChange={(e, { value }) => this.onRoleChange(value, user)}
                                        value={getUserRoleValue(user.organizationRoles[0].permissions)}
                                        options={this.roles}
                                        disabled={!canModify}
                                    />
                                    {canModify && (
                                        <DeleteUserModal userId={user._id} />
                                    )}
                                </div>
                            )}

                        </div>

                        <div>
                            {
                                isOrganizationOwner ? (<div className="ui blue horizontal label">Organization Owner</div>) : null
                            }

                            {
                                user.emailVerified ? (
                                    <div className="ui green horizontal label">Activated</div>
                                ) : (
                                        <div className="ui red horizontal label">Not Activated</div>
                                    )
                            }
                        </div>

                    </List.Content>

                </List.Item>
            )
        }) : (
                <List.Item>

                    <List.Icon name='user' size='large' verticalAlign='middle' />

                    <List.Content>
                        <p> No invited users yet </p>
                    </List.Content>

                </List.Item>
            )

        return (
            <List divided relaxed>
                {template}
            </List >
        );
    }
}

const mapStateToProps = ({ organization, authentication }) => ({
    ...organization,
    user: authentication.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchUsers: (params) => dispatch(fetchUsers(params)),
    editPermissions: (organizationId, userId, permissions) => dispatch(editPermissions(organizationId, userId, permissions))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(UserTable)
);