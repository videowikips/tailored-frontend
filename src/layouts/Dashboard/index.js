import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Grid, Card, Dropdown, Modal, Input, Loader, Dimmer } from 'semantic-ui-react'
import './style.scss';
import Avatar from 'react-avatar';

import websockets from '../../websockets';

import { WEBSOCKET_SERVER_URL } from '../../shared/constants';

import UploadNewVideoModal from '../../shared/components/UploadNewVideoModal';
import NotificationService from '../../shared/utils/NotificationService';
import * as organizationActions from '../../actions/organization';
import * as pollerActions from '../../actions/poller';
import { redirectToSwitchOrganization } from '../../actions/authentication'
import routes from '../../shared/routes';
import RoleRenderer from '../../shared/containers/RoleRenderer';

const NAV_LINKS = [
    {
        title: 'Videos',
        route: routes.organizationVideos(),
        roles: ['admin', 'translate', 'review'],
    },
    {
        title: 'Archive',
        route: routes.organizationArchive(),
        roles: ['admin'],
    },
    {
        title: 'Users',
        route: routes.organizationUsers(),
        roles: ['admin'],
    }
]

const AUTHENTICATE_USER_JOB = 'AUTHENTICATE_USER_JOB';

class Dashboard extends React.Component {
    state = {
        uploadFormOpen: false,
        createOrganizationModalVisible: false,
        currentLocation: '/organization',
    }

    componentDidMount = () => {
        this.props.setNewOrganizationLogo(null);
        this.props.setNewOrganizationName('');
        this.websocketConnection = websockets.createWebsocketConnection(WEBSOCKET_SERVER_URL, {
            path: '/socket.io',
            transports: ['websocket'],
            secure: true,
        })
        if (this.props.userToken && this.props.organization && this.props.organization._id) {
            websockets.subscribeToEvent(websockets.websocketsEvents.AUTHENTICATE_SUCCESS, (data) => {
                console.log('============ auth seccuess', data);
            })
            websockets.subscribeToEvent(websockets.websocketsEvents.AUTHENTICATE_FAILED, (data) => {
                setTimeout(() => {
                    NotificationService.info('Session expired, please login');
                    this.props.history.push(routes.logout())
                }, 1000);
            })
            this.props.startJob({ jobName: AUTHENTICATE_USER_JOB, interval: 60 * 1000, immediate: true }, () => {
                websockets.emitEvent(websockets.websocketsEvents.AUTHENTICATE, { organization: this.props.organization._id, token: this.props.userToken });
            })
        }
    }

    componentWillUnmount = () => {
        if (this.websocketConnection) {
            websockets.disconnectConnection();
        }
        this.props.stopJob(AUTHENTICATE_USER_JOB);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'done') {
            NotificationService.success('Uploaded successfully');
            this.setState({ uploadFormOpen: false });
            // this.props.history.push(`/convert/${nextProps.video._id}`);
        }
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'failed') {
            NotificationService.error(nextProps.uploadError);
            this.setState({ uploadFormOpen: false });
        }
    }

    onCreateOrganization = () => {
        const { newOrganizationName, newOrganizationLogo } = this.props;
        this.props.createOrganization(newOrganizationName, newOrganizationLogo);
    }

    onUploadLogo = (file) => {
        if (file) {
            this.props.updateOrganizationLogo(file);
        }
    }

    canUpload = () => {
        const { organization, user } = this.props;
        if (!user || !organization) return false;
        const userRole = user.organizationRoles.find((role) => role.organization._id === organization._id);
        if (!userRole) return false;
        if (userRole.organizationOwner || userRole.permissions.indexOf('admin') !== -1) return true;
        return false;
    }

    onSwitchOrganization = organizationRole => {
        const { userToken } = this.props;
        this.props.setOrganization(organizationRole.organization);
        this.props.redirectToSwitchOrganization(userToken, organizationRole.organization);
    }

    renderCreateOrganizationModal = () => (
        <Modal open={this.state.createOrganizationModalVisible} size="tiny">
            <Modal.Header>
                Create Organization
            </Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid.Column width={5}>
                            Organization Name
                            <span style={{ color: 'red' }}> *</span>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Input
                                fluid
                                placeholder="name"
                                onChange={(e, { value }) => this.props.setNewOrganizationName(value)}
                                value={this.props.newOrganizationName}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>

                        <Grid.Column width={5}>
                            Logo
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <input
                                accept="image/*"
                                type="file"
                                ref={(ref) => this.logoItemRef = ref}
                                onChange={(e) => this.props.setNewOrganizationLogo(e.target.files[0])}
                            />
                            {this.props.newOrganizationLogo && (

                                <Button icon="close" onClick={() => {
                                    this.props.setNewOrganizationLogo(null);
                                    this.logoItemRef.value = null;
                                }} basic style={{ boxShadow: 'none', marginLeft: 20 }} />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => this.setState({ createOrganizationModalVisible: false })}>Cancel</Button>
                <Button primary onClick={this.onCreateOrganization} disabled={!this.props.newOrganizationName || !this.props.newOrganizationName.trim()}>Create</Button>
            </Modal.Actions>
        </Modal>
    )

    renderUserDropdown = () => {
        const { user, organization } = this.props
        return (
            <Dropdown icon={<Avatar name={user.email} size={40} round="50%" />} floating labeled direction="left">
                <Dropdown.Menu style={{ minWidth: 200 }}>
                    <Dropdown.Header>MY Organizations</Dropdown.Header>
                    {user.organizationRoles.map((role) => (
                        <Dropdown.Item
                            active={organization._id === role.organization._id}
                            key={`organization-dropdown-${role.organization._id}`}
                            onClick={() => this.onSwitchOrganization(role)}
                        >
                            {role.organization.name}
                            {organization._id !== role.organization._id && (
                                <div className="pull-right">
                                    <Icon name="arrow right" />
                                </div>
                            )}
                        </Dropdown.Item>
                    ))}
                    {/* <Dropdown.Divider />
                    <Dropdown.Item onClick={() => this.setState({ createOrganizationModalVisible: true })}>
                        Create Organization
                    </Dropdown.Item> */}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => this.props.history.push('/logout')}  >
                        <Icon name="log out" />
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    render() {
        const { organization } = this.props;
        return (
            <Grid style={{ height: '100%', margin: 0, }}>
                <Grid.Row style={{ padding: 0 }}>
                    <Grid.Column width={3} style={{ height: '100%', backgroundColor: '#1b1c1d', paddingRight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-1rem' }}>

                            <Card style={{ marginTop: 30, marginBottom: 30 }}>
                                <Card.Content className="logo-container">
                                    {this.canUpload() && (
                                        <React.Fragment>
                                            {!organization.logo && (
                                                <div
                                                    onClick={() => this.uploadLogoRef.click()}
                                                    className={`upload-container visible`}
                                                >
                                                    <Button>
                                                        Upload Logo
                                                </Button>
                                                </div>
                                            )}
                                            {organization.logo && (
                                                <div className="edit-logo-container">
                                                    <Button
                                                        // color="blue"
                                                        onClick={() => this.uploadLogoRef.click()}
                                                        basic
                                                        icon="upload"
                                                    />
                                                    {/* <Icon name="edit" /> */}
                                                </div>
                                            )}

                                            <input
                                                accept="image/*"
                                                ref={(ref) => this.uploadLogoRef = ref}
                                                type="file"
                                                style={{ visibility: 'hidden' }}
                                                onChange={(e) => this.onUploadLogo(e.target.files[0])}
                                            />

                                        </React.Fragment>
                                    )}
                                    <img style={{ width: '100%' }} src={this.props.organization && this.props.organization.logo ? this.props.organization.logo : '/img/logo.png'} alt="Logo" />

                                    <Dimmer active={this.props.uploadLogoLoading}>
                                        <Loader />
                                    </Dimmer>
                                </Card.Content>
                            </Card>
                        </div>
                        <Menu
                            fluid
                            vertical
                            tabular
                            style={{ color: 'white', border: 'none' }}
                        >
                            {NAV_LINKS.map((l) => (
                                <RoleRenderer
                                    roles={l.roles}
                                    key={l.title + l.route}
                                >
                                    <Link
                                        to={l.route}
                                        style={{ backgroundColor: this.props.location.pathname.indexOf(l.route) === 0 ? '#eee' : 'transparent', color: this.props.location.pathname.indexOf(l.route) === 0 ? 'black' : 'white', width: '100%', padding: 15, display: 'block' }}
                                        onClick={() => this.setState({ currentLocation: l.route })}
                                    >{l.title}</Link>
                                </RoleRenderer>
                            ))}
                        </Menu>

                    </Grid.Column>
                    <Grid.Column width={13} stretched>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <div style={{ marginTop: 20, marginBottom: 20, height: 40 }}>

                                        <div className="pull-right">
                                            {this.canUpload() && (
                                                <React.Fragment>
                                                    <Button
                                                        color="blue"
                                                        onClick={() => this.setState({ uploadFormOpen: true })} style={{ marginRight: 20 }}>
                                                        <Icon name="upload" />
                                                        Upload New Video
                                                    </Button>
                                                    <UploadNewVideoModal
                                                        open={this.state.uploadFormOpen}
                                                        onClose={() => this.setState({ uploadFormOpen: false })}
                                                    />
                                                </React.Fragment>
                                            )}
                                            {this.props.user && this.renderUserDropdown()}
                                            {this.renderCreateOrganizationModal()}
                                        </div>
                                    </div>
                                    {this.props.children}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = ({ authentication, organization, video, router }) => ({
    user: authentication.user,
    userToken: authentication.token,
    organization: organization.organization,
    newOrganizationName: organization.newOrganizationName,
    newOrganizationLogo: organization.newOrganizationLogo,
    uploadLogoLoading: organization.uploadLogoLoading,
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    video: video.video,
    location: router.location,
})

const mapDispatchToProps = (dispatch) => ({
    setOrganization: org => dispatch(organizationActions.setOrganization(org)),
    setNewOrganizationName: name => dispatch(organizationActions.setNewOrganizationName(name)),
    setNewOrganizationLogo: file => dispatch(organizationActions.setNewOrganizationLogo(file)),
    createOrganization: (name, logoFile) => dispatch(organizationActions.createOrganization(name, logoFile)),
    updateOrganizationLogo: (file) => dispatch(organizationActions.updateOrganizationLogo(file)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: jobName => dispatch(pollerActions.stopJob(jobName)),
    redirectToSwitchOrganization: (token, organization) => dispatch(redirectToSwitchOrganization(token, organization))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));