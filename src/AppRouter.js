import React from 'react'
// import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// import { connect } from 'react-redux'
import LazyRoute from './LazyRoute';

const Home = () => import(/* webpackChunkName: "js/Home"  */'./Pages/Home');

class AppRouter extends React.Component {

  render() {
    return (
      <Router>
        <div className="c-app">
          <Header />
          <div className="c-app__main">
            <Switch>
              <LazyRoute exact path="/" title="VideoWiki" loader={Home} />
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
