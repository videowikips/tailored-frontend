import React from 'react';
import { connect } from 'react-redux';
import * as videoActions from '../../actions/video';
import { Card, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
class VideosList extends React.Component {

    componentWillMount() {
        this.props.fetchOrganizationVideos(this.props.organization._id);
    }

    render() {
        return (
            <Grid style={{ width: '100%' }}>
                <h2>
                    Videos
                </h2>
                <Grid.Row>
                    {this.props.organizationVideos.videosList.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos uploaded yet</div>
                    ) : this.props.organizationVideos.videosList.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <Card fluid>
                                    <video src={video.url} controls width={'100%'} />
                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <Link to={`/organization/article/${video.article}`} >
                                                {video.title}
                                            </Link>
                                        </Card.Header>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        )
                    })}

                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = ({ video, organization, authentication }) => ({
    organizationVideos: video.organizationVideos,
    organization: organization.organization,
    user: authentication.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchOrganizationVideos: id => dispatch(videoActions.fetchOrganizationVideos(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);