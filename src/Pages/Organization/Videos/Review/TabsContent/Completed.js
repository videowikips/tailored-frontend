import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Icon, Card, Button, Modal } from 'semantic-ui-react';
import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as videoActions from '../../modules/actions';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';
import VideoCard from '../../../../../shared/components/VideoCard';

const videoSTATUS = ['done'];

class Completed extends React.Component {
    state = {
        confirmReviewModalVisible: false,
    }

    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
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

    onReviewVideo = video => {
        console.log('on review', video);
        this.props.reviewVideo(video);
    }

    onReviewVideoClick = video => {
        this.props.setSelectedVideo(video);
        this.setState({ confirmReviewModalVisible: true });
    }


    renderConfirmReviewModal = () => (
        <Modal open={this.state.confirmReviewModalVisible} size="tiny">
            <Modal.Header>Re-Review Video</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to re-review this video? <small><strong>( All current translations will be archived )</strong></small></p>

            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    this.setState({ confirmReviewModalVisible: false });
                    this.props.setSelectedVideo(null);
                }}>
                    Cancel
                </Button>
                <Button color="blue" onClick={() => {
                    this.setState({ confirmReviewModalVisible: false });
                    this.onReviewVideo(this.props.selectedVideo);
                    this.props.setSelectedVideo(null);
                }}>
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )



    render() {
        return (
            <LoaderComponent active={this.props.videosLoading}>

                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos completed yet</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <VideoCard
                                    url={video.url}
                                    title={video.title}
                                    buttonTitle="Re-review"
                                    onButtonClick={() => () => this.onReviewVideoClick(video)}
                                    onDeleteVideoClick={() => this.props.onDeleteVideoClick(video)}
                                />
                            </Grid.Column>
                        )
                    })}
                    {this.renderConfirmReviewModal()}
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



export default connect(mapStateToProps, mapDispatchToProps)(Completed);