import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as authActions from '../../actions/authentication';

class Logout extends React.Component {

    componentWillMount() {
        this.props.logout();
        if (!this.props.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('will recieve props')
        if (!nextProps.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>Logging out</div>
        )
    }
}


const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(authActions.logout()),
})

const mapStateToProps = ({ authentication }) => ({
    isAuthenticated: authentication.isAuthenticated,
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout))
