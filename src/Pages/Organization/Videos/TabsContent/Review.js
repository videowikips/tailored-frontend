import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Grid, Card, Dropdown, Icon, Button } from 'semantic-ui-react';

import * as videoActions from '../modules/actions';
import routes from '../../../../shared/routes';
import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import LoaderComponent from '../../../../shared/components/LoaderComponent';

let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));


class Review extends React.Component {

    componentWillMount() {
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: ['proofreading', 'done'] });
    }

    _render = () => {
        return (
            <React.Fragment>

                <Grid.Row>
                    <Grid.Column width={13}>

                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Dropdown
                            fluid
                            search
                            selection
                            onChange={(e, { value }) => {
                                this.props.setLanguageFilter(value)
                                this.props.fetchVideos({ organization: this.props.organization._id, langCode: value })
                            }}
                            options={langsOptions}
                            value={this.props.languageFilter}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires preview</div>
                    ) : this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                {video.status === 'done' && (
                                    <Icon name="check circle" size="large" color="green" style={{ position: 'absolute', right: 0, top: 5, zIndex: 2 }} />
                                )}
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <Link to={`/organization/article/${video.article}`} >
                                                {video.title}
                                            </Link>
                                        </Card.Header>
                                    </Card.Content>
                                    <video src={video.url} controls width={'100%'} />
                                    {/* <Card.Content>
                                    </Card.Content> */}
                                    <Link to={routes.convertProgress(video._id)}>
                                        <Button fluid color="blue">Review</Button>
                                    </Link>

                                </Card>
                            </Grid.Column>
                        )
                    })}

                </Grid.Row>
            </React.Fragment>
        )
    }
    render() {
        return (
            <Grid>
                <LoaderComponent active={this.props.videosLoading}>
                    {this._render()}
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
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: ({ organization, langCode, status }) => dispatch(videoActions.fetchVideos({ organization, langCode, status })),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Review);