import React from 'react';
import Avatar from 'react-avatar';
import './OrganizationSettings.css';

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

                    <div class="ui fluid card">
                        <div class="content"><div class="header">About Amy</div></div>
                        <div class="content">
                            <div class="description">
                                Amy is a violinist with 2 years experience in the wedding industry. She enjoys the outdoors
                                and currently resides in upstate New York.
                            </div>
                        </div>
                        <div class="extra content">
                            <i aria-hidden="true" class="user icon"></i>
                            4 Friends
                         </div>
                    </div>
                </div>
            </div>
        )
    }
}