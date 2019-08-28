import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Icon, Card, Button, Modal } from 'semantic-ui-react';
import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as videoActions from '../../modules/actions';

const videoSTATUS = ['done'];

class Completed extends React.Component {
    state = {
        confirmReviewModalVisible: false,
    }

    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
        this.props.setVideoStatusFilter(videoSTATUS);

        this.props.fetchVideos();
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
                                <Icon
                                    name="check circle"
                                    size="large"
                                    color="green"
                                    style={{ position: 'absolute', right: 0, top: 5, zIndex: 2, visibility: video.status === 'done' ? 'visible' : 'hidden' }}
                                />
                                <Card fluid>

                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            {/* {video.status === 'done' ? (
                                                <Link to={routes.organizationArticle(video.article)} >
                                                    {video.title}
                                                </Link>
                                            ) : } */}
                                            {video.title}
                                        </Card.Header>
                                    </Card.Content>

                                    <video src={video.url} controls preload={'false'} width={'100%'} />

                                    <Card.Content style={{ padding: 0 }}>
                                        <Button fluid color="blue" onClick={() => this.onReviewVideoClick(video)}>
                                            Re-review
                                        </Button>
                                    </Card.Content>

                                </Card>
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