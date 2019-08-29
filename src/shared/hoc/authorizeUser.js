import React from 'react';
import { connect } from 'react-redux';

export default function authorizeUser(WrappedComponent, roles) {


    class CanView extends React.Component {
        render() {
            const userRole = this.props.user.organizationRoles.find((r) => r.organization._id === this.props.organization._id)
            let canView = false;
            if (userRole && userRole.organizationOwner) {
                canView = true;
            } else if (userRole) {
                if (userRole && userRole.permissions.some(p => roles.indexOf(p) !== -1)) {
                    canView = true;
                }
            }
            return canView ? <WrappedComponent {...this.props} /> : <div>You don't have permissions to view this page</div>;
        }
    }

    const mapStateToProps = ({ organization, authentication }) => ({
        organization: organization.organization,
        user: authentication.user,
    })

    return connect(mapStateToProps)(CanView);
}
