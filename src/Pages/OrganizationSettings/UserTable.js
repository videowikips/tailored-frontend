import React, { Component } from 'react'
import { List } from 'semantic-ui-react'
import ChangeRoleModal from './ChangeRoleModal';
import DeleteUserModal from './DeleteUserModal';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchUsers, removeUser } from '../../actions/organization';

class UserTable extends Component {
    componentDidMount() {
        this.props.fetchUsers()
    }

    render() {
        const template = this.props.users.length ? this.props.users.map((user) => {
            const isOrganizationOwner = user.organizationRoles[0].organizationOwner;

            return (
                <List.Item key={user.email}>

                    <List.Icon name='user' size='large' verticalAlign='middle' />

                    <List.Content>

                        <div>
                            <span className="invite-name bold-text">{user.firstname} {user.lastname}</span>  {user.email}

                            <div className="pull-right">
                                {isOrganizationOwner || <ChangeRoleModal email={user.email}/>}
                                {isOrganizationOwner || <DeleteUserModal email={user.email}/>}
                            </div>

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

const mapStateToProps = ({ organization }) => ({
    ...organization
})

const mapDispatchToProps = (dispatch) => ({
    fetchUsers: () => dispatch(fetchUsers())
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(UserTable)
);