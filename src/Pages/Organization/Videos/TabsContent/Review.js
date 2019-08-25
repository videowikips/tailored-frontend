import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Grid, Card, Dropdown, Icon, Button, Pagination, Modal } from 'semantic-ui-react';

import * as videoActions from '../modules/actions';
import routes from '../../../../shared/routes';
import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import LoaderComponent from '../../../../shared/components/LoaderComponent';

import authorizeUser from '../../../../shared/hoc/authorizeUser';
import websockets from '../../../../websockets';

let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));

const videoSTATUS = ['uploaded', 'uploading', 'transcriping', 'cutting', 'proofreading', 'converting', 'done'];

class Review extends React.Component {
    state = {
        confirmReviewModalVisible: false,
    }
    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: videoSTATUS, page: 1 });
        this.socketSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_UPLOADED, (data) => {
            this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: videoSTATUS, page: 1 });
        })
    }

    componentWillUnmount = () => {
        if (this.socketSub) {
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_UPLOADED)
        }
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: videoSTATUS, page: activePage });
    }

    renderPagination = () => (
        <Pagination
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )

    onReviewVideo = video => {
        console.log('on review', video);
        this.props.reviewVideo(video);
    }

    onReviewVideoClick = video => {
        if (video.status === 'done') {
            this.props.setSelectedVideo(video);
            this.setState({ confirmReviewModalVisible: true });
        } else {
            this.onReviewVideo(video);
        }

    }

    onLanguageFilterChange = (e, { value }) => {
        this.props.setLanguageFilter(value);
        this.props.setCurrentPageNumber(1)
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: value, status: videoSTATUS, page: 1 })
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
            <Grid>
                <LoaderComponent active={this.props.videosLoading}>


                    <Grid.Row>
                        <Grid.Column width={13}>
                            <div className="pull-right">
                                {this.renderPagination()}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Dropdown
                                fluid
                                search
                                selection
                                onChange={this.onLanguageFilterChange}
                                options={langsOptions}
                                value={this.props.languageFilter}
                            />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        {this.props.videos && this.props.videos.length === 0 ? (
                            <div style={{ margin: 50 }}>No videos requires preview</div>
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
                                                {video.status === 'done' ? (
                                                    <Link to={routes.organizationArticle(video.article)} >
                                                        {video.title}
                                                    </Link>
                                                ) : video.title}
                                            </Card.Header>
                                        </Card.Content>

                                        <video src={video.url} controls width={'100%'} />

                                        <Card.Content style={{ padding: 0 }}>
                                            <Button fluid color="blue" onClick={() => this.onReviewVideoClick(video)}>{video.status === 'done' ? 'Re-Review' : 'Review'}</Button>
                                        </Card.Content>

                                    </Card>
                                </Grid.Column>
                            )
                        })}

                    </Grid.Row>
                    {this.renderConfirmReviewModal()}
                </LoaderComponent>
            </Grid>
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
});


export default connect(mapStateToProps, mapDispatchToProps)(authorizeUser(Review, ['admin', 'review']));