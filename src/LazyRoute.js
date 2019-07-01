import React from 'react';
import Loadable from 'react-loadable';
import {
  Route,
} from 'react-router-dom';
import DocumentMeta from 'react-document-meta';
import LoaderOverlay from './shared/components/LoaderOverlay';

class LazyRoute extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.location.pathname !== nextProps.location.pathname || this.props.location.search !== nextProps.location.search;
  }

  render() {
    const { loader, title, ...rest } = this.props;
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

    return (
      !title ? 
        <Route {...rest} component={LoadableComponent} />
      : (
        <DocumentMeta title={title}>
          <Route {...rest} component={LoadableComponent} />
        </DocumentMeta>
      )
    )
  }
}

// LazyRoute.propTypes = {
//   loader: PropTypes.func.isRequired,
// }

export default LazyRoute;
