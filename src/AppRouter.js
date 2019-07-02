import React from 'react'
// import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import Header from './shared/components/Header';
import Footer from './shared/components/Footer';

import LazyRoute from './LazyRoute';

import './App.css';

const Home = () => import(/* webpackChunkName: "js/Home"  */'./Pages/Home');
const Proofreading = () => import( /* webpackChunkName: "js/Proofreading" */ './Pages/Proofreading');
const Demo = () => import(/* webpackChunkName: "js/Demo" */ './Pages/Demo');
const Convert = () => import(/* webpackChunkName: "js/Convert/" */ './Pages/Convert');
const OrganizationSignUp = () => import(/* webpackChunkName: "js/Home"  */'./Pages/OrganizationSignUp');

class AppRouter extends React.Component {

  render() {
    return (
      <Router>
        <div className="c-app">
          <Header />
          <div className="c-app__main">
            <Switch>
              <LazyRoute exact path="/" title="VideoWiki" loader={Home} />
              <LazyRoute exact path="/proofreading" title="Proofreading" loader={Proofreading} />
              <LazyRoute exact path="/demo" title="Demo" loader={Demo} />
              <LazyRoute exact path="/convert/:videoId" title="Demo" loader={Convert} />
              <LazyRoute exact path="/organization/signup" title="VideoWiki" loader={OrganizationSignUp} />
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
