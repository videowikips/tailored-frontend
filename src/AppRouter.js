import React from 'react'
// import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
// import { connect } from 'react-redux'
import LazyRoute from './LazyRoute';

const Home = () => import(/* webpackChunkName: "js/Home"  */'./Pages/Home');
const Demo = () => import(/* webpackChunkName: "js/Demo" */ './Pages/Demo');
const Convert = () => import(/* webpackChunkName: "js/Convert/" */ './Pages/Convert');
const Test = () => import('./Pages/Test')
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
              <LazyRoute exact path="/test" title="Test" loader={Test} />
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
