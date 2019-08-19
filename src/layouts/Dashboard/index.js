import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Grid, Card, Dropdown } from 'semantic-ui-react'
import Avatar from 'react-avatar';

import websockets from '../../websockets';

import { WEBSOCKET_SERVER_URL } from '../../shared/constants';

import UploadNewVideoModal from '../../shared/components/UploadNewVideoModal';
import NotificationService from '../../shared/utils/NotificationService';
import { uploadVideo } from '../../actions/video';
import routes from '../../shared/routes';

const NAV_LINKS = [
    {
        title: 'Videos',
        route: routes.organizationVideos(),
    },
    {
        title: 'Archive',
        route: routes.organizationArchive(),
    },
    {
        title: 'Users',
        route: routes.organizationUsers()
    }
]

class Dashboard extends React.Component {
    state = {
        uploadFormOpen: false,
        videoForm: {
            title: '',
            numberOfSpeakers: 1,
            langCode: 'en-US',
            video: null,
            fileContent: null,
        },
        currentLocation: '/organization',
    }

    componentDidMount = () => {
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
            websockets.emitEvent(websockets.websocketsEvents.AUTHENTICATE, { organization: this.props.organization._id, token: this.props.userToken });
        }
    }

    componentWillUnmount = () => {
        if (this.websocketConnection) {
            websockets.disconnectConnection();
        }
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

    onUploadFormChange = (changes) => {
        this.setState(state => {
            const { videoForm } = state;
            Object.keys(changes).forEach((key) => {
                videoForm[key] = changes[key];
            })
            return { videoForm };
        });
    }

    onSubmit = (values) => {
        this.props.uploadVideo({ ...values, organization: this.props.organization._id });
    }

    isFormValid = () => {
        const { videoForm } = this.state;
        const { title, numberOfSpeakers, langCode, video } = videoForm;
        if (!title || !numberOfSpeakers || !langCode || !video) return false;
        return true;
    }

    canUpload = () => {
        const { organization, user } = this.props;
        const userRole = user.organizationRoles.find((role) => role.organization._id === organization._id);
        if (!userRole) return false;
        if (userRole.organizationOwner || userRole.permissions.indexOf('admin') !== -1) return true;
        return false;
    }

    renderUserDropdown = () => {
        return (
            <Dropdown icon={<Avatar name={this.props.user.email} size={40} round="50%" />} floating labeled direction="left">
                <Dropdown.Menu style={{ minWidth: 200 }}>

                    <Dropdown.Item onClick={() => this.props.history.push('/logout')}  >
                        <Icon name="log out" />
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    render() {
        return (
            <Grid style={{ height: '100%', margin: 0, }}>
                <Grid.Row style={{ padding: 0 }}>
                    <Grid.Column width={3} style={{ height: '100%', backgroundColor: '#1b1c1d', paddingRight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-1rem' }}>
                            <Card style={{ marginTop: 30 }}>
                                <Card.Content>
                                    <img src="/img/logo.png" alt="Video Wiki Logo" />
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
                                <Link
                                    key={l.title + l.route} to={l.route}
                                    style={{ backgroundColor: this.props.location.pathname.indexOf(l.route) === 0 ? '#eee' : 'transparent', color: this.props.location.pathname.indexOf(l.route) === 0 ? 'black' : 'white', width: '100%', padding: 15, display: 'block' }}
                                    onClick={() => this.setState({ currentLocation: l.route })}
                                >{l.title}</Link>
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
                                                        onChange={this.onUploadFormChange}
                                                        onSubmit={this.onSubmit}
                                                        value={this.state.videoForm}
                                                        valid={this.isFormValid() && this.props.uploadState !== 'loading'}
                                                        loading={this.props.uploadState === 'loading'}
                                                        uploadProgress={this.props.uploadProgress}
                                                    />
                                                </React.Fragment>
                                            )}
                                            {this.props.user && this.renderUserDropdown()}
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
    uploadProgress: video.uploadProgress,
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    video: video.video,
    location: router.location,
})

const mapDispatchToProps = (dispatch) => ({
    uploadVideo: values => dispatch(uploadVideo(values)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));