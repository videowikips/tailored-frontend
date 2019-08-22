import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import querystring from 'query-string';
import { Form, Label, Grid } from 'semantic-ui-react';

import LoaderComponent from '../../shared/components/LoaderComponent';

import * as actions from './modules/actions';

class Invitations extends React.Component {

    componentWillMount = () => {
        const { organizationId } = this.props.match.params;
        const { s, t, email } = querystring.parse(window.location.search)
        console.log('org id', organizationId, s, t);
        this.props.respondToInvitation(organizationId, s, t, email);
    }

    onSubmit = () => {
        this.props.updatePassword()
    }

    renderPasswordForm = () => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#eee' }}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2} />
                    <Grid.Column width={10}>
                        <div>
                            <img src="/img/logo.png" style={{ width: '100%', position: 'relative', top: -50 }} alt="Video Wiki Logo" />
                        </div>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5} />
                    <Grid.Column width={4}>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <p>Set your password</p>
                            {/* <Label>New Password</Label> */}
                            <Form.Input fluid type="password" value={this.props.password} placeholder="password" onChange={(e, { value }) => this.props.setPassword(value)} />
                            {/* <Label>Confirm password</Label> */}
                            <Form.Input fluid type="password" value={this.props.passwordConfirm} placeholder="Confirm Password" onChange={(e, { value }) => this.props.setPasswordConfirm(value)} />
                            <Form.Button
                                className="pull-right"
                                primary
                                onClick={this.onSubmit}
                                disabled={!this.props.password || this.props.password.length < 6 || this.props.password !== this.props.passwordConfirm}
                                loading={this.props.passwordLoading}    
                            >Submit</Form.Button>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )

    render() {
        return (
            <LoaderComponent active={this.props.loading}>
                {this.props.showPasswordForm && this.renderPasswordForm()}
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ invitations }) => ({
    loading: invitations.loading,
    password: invitations.password,
    passwordConfirm: invitations.passwordConfirm,
    showPasswordForm: invitations.showPasswordForm,
    passwordLoading: invitations.passwordLoading,
});

const mapDispatchToProps = (dispatch) => ({
    respondToInvitation: (organizationId, status, token, email) => dispatch(actions.respondToInvitation(organizationId, status, token, email)),
    setPassword: password => dispatch(actions.setPassword(password)),
    setPasswordConfirm: password => dispatch(actions.setPasswordConfirm(password)),
    updatePassword: () => dispatch(actions.updatePassword())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Invitations));