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
const Proofreading = () => import( /* webpackChunkName: "js/Proofreading" */ './Pages/Proofreading');

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
