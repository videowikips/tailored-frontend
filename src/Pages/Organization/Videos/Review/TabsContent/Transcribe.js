import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Grid, Card, Icon, Button } from 'semantic-ui-react';

import * as videoActions from '../../modules/actions';

import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';
import VideoCard from '../../../../../shared/components/VideoCard';

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
                    <Grid.Column width={16}>
                        <Button
                            className="pull-right"
                            color="blue"
                            disabled={this.props.videos.length === 0}
                            onClick={() => this.onReviewVideo({ _id: 'all' })}
                        >Transcribe All</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires preview</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                                <VideoCard
                                    url={video.url}
                                    title={video.title}
                                    buttonTitle="AI Transcribe"
                                    loading={['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1}
                                    disabled={['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1}
                                    onButtonClick={() => this.onReviewVideo(video)}
                                    onDeleteVideoClick={() => this.props.onDeleteVideoClick(video)}
                                />
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