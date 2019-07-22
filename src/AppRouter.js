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
const OrganizationSettings = () => import('./Pages/OrganizationSettings');


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
              <LazyRoute exact path="/convert/:videoId" title="Demo" loader={Convert} />
              <LazyRoute exact path="/organization/settings" title="VideoWiki" isPrivateRoute={true} loader={OrganizationSettings} />
              <LazyRoute path="/dashboard/article/:articleId" title="Article" loader={Article} layout={DashboardLayout} />
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
