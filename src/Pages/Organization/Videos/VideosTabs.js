import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tabs from '../../../shared/components/Tabs';
import routes from '../../../shared/routes';
import { canUserAccess, getUserOrganziationRole } from '../../../shared/utils/helpers';

const items = [{ title: 'Review' }, { title: 'Translations' }];

class VideosTabs extends React.Component {
    state = {
        currentTitle: '',
        tabItems: [],
    }
    componentDidMount = () => {
        const { user, organization } = this.props;
        const { pathname } = this.props.location;
        let tabItems = [];
        const organizationRole = getUserOrganziationRole(user, organization);
        if (!organizationRole) return this.redirectUnauthorizedUser();

        if (organizationRole.organizationOwner || (organizationRole.permissions && organizationRole.permissions.indexOf('admin') !== -1)) {
            tabItems = [...items];
        } else {
            if (organizationRole.permissions.indexOf('review') !== -1) {
                tabItems.push({ title: 'Review' })
            }

            if (organizationRole.permissions.indexOf('translate') !== -1) {
                tabItems.push({ title: 'Translations' })
            }
        }
        this.setState({ tabItems });
        switch (pathname) {
            case routes.organziationTranslations():
                this.setState({ currentTitle: 'Translations', tabItems }); break;
            case routes.organziationReview():
                this.setState({ currentTitle: 'Review' }); break;
            default:
                this.setState({ currentTitle: 'Review' }); break;
        }
    }

    onActiveIndexChange = (val) => {
        const currentTitle = this.state.tabItems[val].title;
        this.setState({ currentTitle });
        switch (currentTitle.toLowerCase()) {
            case 'review':
                return this.props.history.push(routes.organziationReview());
            case 'translations':
                this.props.history.push(routes.organziationTranslations());
                return;
            default:
                break;
        }
    }

    render() {
        return (
            <Tabs
                items={this.state.tabItems}
                activeIndex={this.state.tabItems.map((i) => i.title).indexOf(this.state.currentTitle)}
                onActiveIndexChange={val => this.onActiveIndexChange(val)}
            />
        )
    }
}

const mapStateToProps = ({ authentication, organization }) => ({
    user: authentication.user,
    organization: organization.organization,
})


export default connect(mapStateToProps)(withRouter(VideosTabs));
