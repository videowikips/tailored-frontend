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
import DashboardLayout from './layouts/Dashboard';

const Home = () => import('./Pages/Home');
const Demo = () => import('./Pages/Demo');
const Convert = () => import( './Pages/Convert');
const Test = () => import('./Pages/Test')
const Article = () => import('./Pages/Article');


class AppRouter extends React.Component {

  render() {
    return (
      <Router>
        <div className="c-app">
          {/* <Header /> */}
          {/* <div className="c-app__main"> */}
            <Switch>
              <LazyRoute exact path="/" title="VideoWiki" loader={Home} />
              <LazyRoute exact path="/test" title="Test" loader={Test} />

              <LazyRoute exact path="/demo" title="Demo" loader={Demo} layout={DashboardLayout} />
              <LazyRoute exact path="/convert/:videoId" title="Demo" loader={Convert} layout={DashboardLayout} />
              <LazyRoute path="/article/:articleId" title="Article" loader={Article}  layout={DashboardLayout}/>
            </Switch>
          {/* </div> */}
          {/* <Footer /> */}
        </div>
      </Router>
    )
  }
}

export default AppRouter;

// AppRouter.propTypes = {
//   match: PropTypes.object,
// }
