import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Grid, Card, Icon, Button } from 'semantic-ui-react';

import * as videoActions from '../../modules/actions';

import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';

const videoSTATUS = ['uploaded', 'uploading', 'transcriping', 'cutting'];

class Transcribe extends React.Component {
    state = {
        activeTab: 0,
    }

    componentWillMount = () => {
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchVideos({ organization: this.props.organization._id });

        this.videoUploadedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_UPLOADED, (data) => {
            this.props.fetchVideos();
        })
        this.videoTranscribedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, (video) => {
            if (this.props.videos.map((video) => video._id).indexOf(video._id) !== -1) {
                this.props.fetchVideos();
                NotificationService.info(`${video.title} Has finished transcribing and ready for Proofreading`);
            }
        })
    }

    componentWillUnmount = () => {
        if (this.videoUploadedSub) {
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_UPLOADED)
        }
        if (this.videoTranscribedSub) {
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED);
        }
    }


    onReviewVideo = video => {
        console.log('on review', video);
        this.props.reviewVideo(video);
    }

    render() {
        return (

            <LoaderComponent active={this.props.videosLoading}>

                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires preview</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                                <Icon
                                    name="check circle"
                                    size="large"
                                    color="green"
                                    style={{ position: 'absolute', right: 0, top: 5, zIndex: 2, visibility: video.status === 'done' ? 'visible' : 'hidden' }}
                                />
                                <Card fluid>

                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            {video.status === 'done' ? (
                                                <Link to={routes.organizationArticle(video.article)} >
                                                    {video.title}
                                                </Link>
                                            ) : video.title}
                                        </Card.Header>
                                    </Card.Content>

                                    <video src={video.url} controls preload={'false'} width={'100%'} height={200} />

                                    <Card.Content style={{ padding: 0 }}>
                                        <Button fluid color="blue" onClick={() => this.onReviewVideo(video)} 
                                            loading={['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1}
                                            disabled={['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1}
                                            >
                                            AI Transcribe
                                        </Button>
                                    </Card.Content>

                                </Card>
                            </Grid.Column>
                        )
                    })}

                </Grid.Row>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    videos: organizationVideos.videos,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
    selectedVideo: organizationVideos.selectedVideo,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    reviewVideo: video => dispatch(videoActions.reviewVideo(video)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Transcribe);