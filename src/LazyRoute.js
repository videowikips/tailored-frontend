import React from 'react';
import Loadable from 'react-loadable';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import DocumentMeta from 'react-document-meta';
import LoaderOverlay from './shared/components/LoaderOverlay';
import { connect } from 'react-redux';
import { isValidToken } from './actions/authentication';

class LazyRoute extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search
      || (this.props.isAuthenticated !== nextProps.isAuthenticated && !!this.props.isPrivateRoute);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isAuthenticated) {
      window.location = '/';
    }
  }

  render() {
    const { loader, title, isPrivateRoute, ...rest } = this.props;

    const LoadableComponent = Loadable({
      loader,
      loading: (props) => {
        if (props.error) {
          console.log('error is', props.error);
        }
        return (
          <LoaderOverlay loaderImage="/img/edit-loader.gif" />
        )
      },
    });

    if (isPrivateRoute) {
      if (this.props.token) {
        if (!this.props.isAuthenticated) {
          this.props.isValidToken();
        }
      } else {
        return (
          <Redirect to='/' />
        )
      }
    }

    const hasPermission = !isPrivateRoute || this.props.isAuthenticated;

    return (
      hasPermission ? (!title ?
        <Route {...rest} component={LoadableComponent} />
        : (
          <DocumentMeta title={title}>
            <Route {...rest} component={LoadableComponent} />
          </DocumentMeta>
        )) : (
          <div>
            <LoaderOverlay loaderImage="/img/edit-loader.gif" />
          </div>
        )
    )

  }
}

const mapStateToProps = ({ authentication }) => ({
  ...authentication
});

const mapDispatchToProps = (dispatch) => ({
  isValidToken: () => dispatch(isValidToken()),
})

// LazyRoute.propTypes = {
//   loader: PropTypes.func.isRequired,
// }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LazyRoute));
