import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import { authenticateWithToken } from '../../actions/authentication';
import LoaderOverlay from '../../shared/components/LoaderOverlay';

class LoginRedirect extends React.Component {

    componentWillMount = () => {
        const { t, o } = querystring.parse(window.location.search);
        this.props.authenticateWithToken(t, o)
    }
    render() {
        return (
            <LoaderOverlay />
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    authenticateWithToken: (token, organizationId) => dispatch(authenticateWithToken(token, organizationId)),
})

export default connect(null, mapDispatchToProps)(LoginRedirect);