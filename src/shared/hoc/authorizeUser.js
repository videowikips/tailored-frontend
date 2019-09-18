import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserOrganziationRole } from '../utils/helpers';
import routes from '../routes';

export default function authorizeUser(WrappedComponent, roles) {


    class CanView extends React.Component {

        redirectUnauthorizedUser = () => {
            const { user, organization } = this.props;
            const organizationRole = getUserOrganziationRole(user, organization);
            if (!organizationRole) {
                return this.props.history.push(routes.logout());
            }
            if (organizationRole.permissions.indexOf('translate') !== -1) {
                return this.props.history.push(routes.organziationTranslations());
            }
            if (organizationRole.permissions.indexOf('review') !== -1) {
                return this.props.history.push(routes.organziationReview());
            }
            return this.props.history.push(routes.logout());

        }
        
        render() {
            const userRole = getUserOrganziationRole(this.props.user, this.props.organization)
            let canView = false;
            if (userRole && userRole.organizationOwner) {
                canView = true;
            } else if (userRole) {
                if (userRole && userRole.permissions.some(p => roles.indexOf(p) !== -1)) {
                    canView = true;
                }
            }
            if (!canView) {
                this.redirectUnauthorizedUser();
            }
            return canView ? <WrappedComponent {...this.props} /> : <div>You don't have permissions to view this page</div>;
        }
    }

    const mapStateToProps = ({ organization, authentication }) => ({
        organization: organization.organization,
        user: authentication.user,
    })

    return withRouter(connect(mapStateToProps)(CanView));
}
