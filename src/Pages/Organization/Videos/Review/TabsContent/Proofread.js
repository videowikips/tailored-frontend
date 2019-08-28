import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Icon, Card, Button } from 'semantic-ui-react';
import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as videoActions from '../../modules/actions';

const videoSTATUS = ['proofreading', 'converting'];

class Proofread extends React.Component {

    componentWillMount = () => {
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchVideos({ organization: this.props.organization._id });
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
                                <Icon
                                    name="check circle"
                                    size="large"
                                    color="green"
                                    style={{ position: 'absolute', right: 0, top: 5, zIndex: 2, visibility: video.status === 'done' ? 'visible' : 'hidden' }}
                                />
                                <Card fluid>

                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            {video.title}
                                        </Card.Header>
                                    </Card.Content>

                                    <video src={video.url} controls preload={'false'} width={'100%'} />

                                    <Card.Content style={{ padding: 0 }}>
                                        <Button fluid color="blue"
                                            disabled={video.status === 'converting'}
                                            loading={video.status === 'converting'}
                                        >
                                            <Link to={routes.convertProgress(video._id)} style={{ color: 'white' }}>
                                                Proofread
                                            </Link>
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



export default connect(mapStateToProps, mapDispatchToProps)(Proofread);