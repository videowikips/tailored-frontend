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
import authorizeUser from './shared/hoc/authorizeUser';

class LazyRoute extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.location.pathname !== nextProps.location.pathname
      || this.props.location.search !== nextProps.location.search
      || (this.props.isAuthenticated !== nextProps.isAuthenticated && !!this.props.isPrivateRoute);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated !== this.props.isAuthenticated && !nextProps.isAuthenticated) {
      window.location = '/';
    }
  }

  render() {
    const { loader, title, isPrivateRoute, authorize, ...rest } = this.props;

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

    if (!hasPermission) {
      return (
        <div>
          <LoaderOverlay loaderImage="/img/edit-loader.gif" />
        </div>
      );
    }

    const LayoutComp = this.props.layout;
    let RenderedComp;
    if (!LayoutComp) {

      RenderedComp =  (
        <DocumentMeta title={title || 'Videowiki'}>
          <Route {...rest} component={LoadableComponent} />
        </DocumentMeta>
      )
    } else {
      RenderedComp = (
        <DocumentMeta title={title || 'Videowiki'}>
          <LayoutComp>
            <Route {...rest} component={LoadableComponent} />
          </LayoutComp>
        </DocumentMeta>
      )
    }

    // Check for authorization roles
    if (!authorize || authorize.length === 0) {
      return RenderedComp;
    }
    class WrappedAuthorizedComp extends React.Component {
      render() {
        return RenderedComp;
      }
    }
    const AuthorizedComp = authorizeUser(WrappedAuthorizedComp, authorize)
    return <AuthorizedComp />;

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
