import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Icon, Card, Button } from 'semantic-ui-react';
import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as videoActions from '../../modules/actions';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';
import VideoCard from '../../../../../shared/components/VideoCard';

const videoSTATUS = ['proofreading', 'converting'];

class Proofread extends React.Component {

    componentWillMount = () => {
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchVideos();
        this.videoDoneSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_DONE, (video) => {
            this.props.fetchVideos();
            NotificationService.success(`The video "${video.title}" has been converted successfully!`);
        })
    }

    componentWillUnmount = () => {
        if (this.videoDoneSub) {
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_DONE);
        }
    }

    navigateToConvertProgresss = videoId => {
        this.props.history.push(routes.convertProgress(videoId));
    }

    render() {
        return (
            <LoaderComponent active={this.props.videosLoading}>

                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires proofreading</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <VideoCard
                                    url={video.url}
                                    title={video.title}
                                    buttonTitle="Proofread"
                                    loading={video.status === 'converting'}
                                    disabled={video.status === 'converting'}
                                    onButtonClick={() => this.navigateToConvertProgresss(video._id)}
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



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Proofread));