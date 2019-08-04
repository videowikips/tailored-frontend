import React from 'react'
// import PropTypes from 'prop-types'
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

const Home = () => import('./Pages/Home');
const Demo = () => import('./Pages/Demo');
const Convert = () => import('./Pages/Convert');
const Logout = () => import('./Pages/Logout');

const Article = () => import('./Pages/Organization/Article');
const OrganizationUsers = () => import('./Pages/Organization/OrganizationUsers');
const Videos = () => import('./Pages/Organization/Videos');
const TranslateArticle = () => import('./Pages/Translation/TranslateArticle');

class AppRouter extends React.Component {

  render() {
    return (
        <div className="c-app">
          <Header />
          <div className="c-app__main">
            <Switch>
              <LazyRoute exact path={routes.home()} title="VideoWiki" loader={Home} />
              <LazyRoute exact path={routes.logout()} loader={Logout} />
              <LazyRoute exact path={routes.demo()} title="Demo" loader={Demo} />
              <LazyRoute exact path={routes.convertProgress()} title="Convert Video" loader={Convert} />
            {/* === Organization routes === */}
              <LazyRoute exact path={routes.organizationUsers()} title="Organziation: Users" isPrivateRoute={true} loader={OrganizationUsers} layout={DashboardLayout} />
              <LazyRoute path={routes.organizationVideos()} isPrivateRoute={true} title="Organziation: Videos" loader={Videos} layout={DashboardLayout} />
              <LazyRoute exact path={routes.organizationHome()} isPrivateRoute={true} title="Organziation: Videos" loader={Videos} layout={DashboardLayout} />
              <LazyRoute path={routes.organizationArticle()} title="Organziation: Article" loader={Article} layout={DashboardLayout} />
            {/* ==== End Organization routes === */}

            {/* === Translation routes === */}
              
              <LazyRoute path={routes.translationArticle()} title="Translate Article" isPrivateRoute={true} loader={TranslateArticle} layout={DashboardLayout} />
            {/* === End Translation routes === */}
            </Switch>
          </div>
          <Footer />
        </div>
    )
  }
}

export default AppRouter;

// AppRouter.propTypes = {
//   match: PropTypes.object,
// }
