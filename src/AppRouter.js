import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import './App.css';

import routes from './shared/routes';

import Header from './shared/components/Header';
import Footer from './shared/components/Footer';

import LazyRoute from './LazyRoute';
import DashboardLayout from './layouts/Dashboard';
import * as authenticationActions from './actions/authentication';

const Home = () => import('./Pages/Home');
const LoginRedirect = () => import('./Pages/LoginRedirect');
const Demo = () => import('./Pages/Demo');
const Convert = () => import('./Pages/Convert');
const Logout = () => import('./Pages/Logout');

const Article = () => import('./Pages/Organization/Article');

const OrganizationUsers = () => import('./Pages/Organization/OrganizationUsers');
const OrganizationArchive = () => import('./Pages/Organization/Archive');
// const OrganizationVideos = () => import('./Pages/Organization/Videos');
const OrganizationReview = () => import('./Pages/Organization/Videos/Review');
const OrganzationTranslations = () => import('./Pages/Organization/Videos/Translations');

const TranslateArticle = () => import('./Pages/Translation/TranslateArticle');

const Invitations = () => import('./Pages/Invitations');

class AppRouter extends React.Component {

  componentWillMount = () => {
    if (this.props.isAuthenticated) {
      this.props.getUserDetails();
    }
  }

  render() {
    return (
      <div className="c-app">
        <Header />
        <div className="c-app__main">
          <Switch>
            <LazyRoute
              exact
              path={routes.home()}
              title="VideoWiki"
              loader={Home}
            />
            <LazyRoute
              exact
              path={routes.loginRedirect()}
              title="VideoWiki"
              loader={LoginRedirect}
            />
            <LazyRoute
              exact
              path={routes.logout()}
              loader={Logout}
            />
            {/* <LazyRoute exact path={routes.demo()} title="Demo" loader={Demo} /> */}
            <LazyRoute
              exact
              path={routes.convertProgress()}
              title="Convert Video"
              loader={Convert}
            />
            {/* === Organization routes === */}
            <LazyRoute
              exact
              path={routes.organizationUsers()}
              title="Organziation: Users"
              isPrivateRoute={true}
              authorize={['admin']}
              loader={OrganizationUsers}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organizationVideos()}
              isPrivateRoute={true}
              title="Organziation: Videos"
              authorize={['admin', 'review']}
              loader={OrganizationReview}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organizationHome()}
              isPrivateRoute={true}
              title="Organziation: Videos"
              loader={OrganizationReview}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organizationArchive()}
              isPrivateRoute={true}
              authorize={['admin']}
              title="Organziation: Archive"
              loader={OrganizationArchive}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organizationArticle()}
              isPrivateRoute={true}
              title="Organziation: Article"
              loader={Article}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organziationReview()}
              isPrivateRoute={true}
              title="Organziation: Reviews"
              authorize={['admin', 'review']}
              loader={OrganizationReview}
              layout={DashboardLayout}
            />
            <LazyRoute
              exact
              path={routes.organziationTranslations()}
              isPrivateRoute={true}
              title="Organziation: Translations"
              authorize={['admin', 'translate']}
              loader={OrganzationTranslations}
              layout={DashboardLayout}
            />
            {/* ==== End Organization routes === */}

            {/* === Translation routes === */}

            <LazyRoute
              path={routes.translationArticle()}
              title="Translate Article"
              isPrivateRoute={true}
              loader={TranslateArticle}
              layout={DashboardLayout}
            />
            {/* === End Translation routes === */}

            {/* Invitations routes */}
            <LazyRoute
              path={routes.invitationsRoute()}
              title="Invitation"
              loader={Invitations}
            />
            {/* End invitations routes  */}
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = ({ authentication }) => ({
  user: authentication.user,
  isAuthenticated: authentication.isAuthenticated,
})

const mapDispatchToProps = dispatch => ({
  getUserDetails: () => dispatch(authenticationActions.getUserDetails()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

// AppRouter.propTypes = {
//   match: PropTypes.object,
// }
