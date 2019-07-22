import React from 'react'
// import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import './App.css';

import Header from './shared/components/Header';
import Footer from './shared/components/Footer';

import LazyRoute from './LazyRoute';
import DashboardLayout from './layouts/Dashboard';

const Home = () => import('./Pages/Home');
const Demo = () => import('./Pages/Demo');
const Convert = () => import('./Pages/Convert');
const Article = () => import('./Pages/Article');
const OrganizationUsers = () => import('./Pages/OrganizationUsers');
const UploadVideo = () => import('./Pages/UploadVideo');
const Logout = () => import('./Pages/Logout');
const VideosList = () => import('./Pages/VideosList');
class AppRouter extends React.Component {

  render() {
    return (
      <Router>
        <div className="c-app">
          <Header />
          <div className="c-app__main">
            <Switch>
              <LazyRoute exact path="/" title="VideoWiki" loader={Home} />
              <LazyRoute exact path="/demo" title="Demo" loader={Demo} />
              <LazyRoute exact path="/convert/:videoId" title="Convert Video" loader={Convert} />
              <LazyRoute exact path="/organization/users" title="VideoWiki" isPrivateRoute={true} loader={OrganizationUsers} layout={DashboardLayout} />
              <LazyRoute path="/organization/upload" isPrivateRoute={true} title="Upload Video" loader={UploadVideo} layout={DashboardLayout} />
              <LazyRoute path="/organization/videos" isPrivateRoute={true} title="Videos" loader={VideosList} layout={DashboardLayout} />
              <LazyRoute path="/organization/article/:articleId" isPrivateRoute={true} title="Article" loader={Article} layout={DashboardLayout} />
              <LazyRoute path="/logout" loader={Logout} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default AppRouter;

// AppRouter.propTypes = {
//   match: PropTypes.object,
// }
