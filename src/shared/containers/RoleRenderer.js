import React from 'react';
import {connect} from 'react-redux';

class RoleRenderer extends React.Component {

    canView = () => {
        if (!this.props.user || !this.props.user.organizationRoles) return false;
        const userRole = this.props.user.organizationRoles.find((r) => r.organization._id === this.props.organization._id)
        if (userRole && userRole.organizationOwner) {
            return true;
        } else if (userRole) {
            if (userRole && userRole.permissions.some(p => this.props.roles.indexOf(p) !== -1)) {
                return true;
            }
        }
        return false;
    }

    render() {
        return this.canView() ? this.props.children : <div>You don't have permissions to view this page</div>
    }
}

const mapStateToProps = ({ authentication, organization }) => ({
    user: authentication.user,
    organization: organization.organization,
})
export default connect(mapStateToProps)(RoleRenderer);