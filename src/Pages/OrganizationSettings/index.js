import React from 'react';
import Avatar from 'react-avatar';
import './OrganizationSettings.css';
import InviteModal from './InviteModal';
import UserTable from './UserTable';
import { Button, Icon } from 'semantic-ui-react'

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <h2 className="ui header">
                    Organization Settings

                <div className="pull-right">
                        <Avatar name="Partik" size={40} round="50%" />
                    </div>
                </h2>

                <div className="wrapper">
                    <h2>Users</h2>

                    <div className="ui fluid card">

                        <div className="content">
                            <div className="header">
                                Organization Users

                                <div className="pull-right">
                                    <Button icon primary labelPosition='left'>
                                        <Icon name='plus' />
                                        Invite New User
                                    </Button>
                                </div>
                            </div>


                        </div>

                        <div className="content">
                            <UserTable />
                        </div>

                    </div>
                </div>

                <InviteModal />
            </div>
        )
    }
}