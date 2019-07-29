import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Grid, Card, Select, Dropdown, Icon, Button, Loader } from 'semantic-ui-react';

import * as videoActions from '../modules/actions';
import routes from '../../../../shared/routes';
import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import AddHumanVoiceModal from '../../../../shared/components/AddHumanVoiceModal';
import LoaderComponent from '../../../../shared/components/LoaderComponent';

let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));


class Translations extends React.Component {

    componentWillMount() {
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: ['done'] });
    }

    onAddHumanVoice = lang => {
        this.props.setAddHumanVoiceModalVisible(false);
        this.props.history.push(routes.translationArticle(this.props.selectedVideo.article) + `?lang=${lang}`);
    }

    _renderAddHumanVoiceModal() {
        return (
            <AddHumanVoiceModal
                open={this.props.addHumanVoiceModalVisible}
                onClose={() => this.props.setAddHumanVoiceModalVisible(false)}
                skippable={false}
                onSubmit={(val) => this.onAddHumanVoice(val)}
            />
        )
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
                        <div style={{ margin: 50 }}>No videos requires Translations</div>
                    ) : this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header style={{ textAlign: 'center' }}>
                                            <Link to={`/organization/article/${video.article}`} >
                                                {video.title}
                                            </Link>
                                        </Card.Header>
                                    </Card.Content>
                                    <video src={video.url} controls width={'100%'} />
                                    <Button fluid color="blue" onClick={() => {
                                        this.props.setSelectedVideo(video);
                                        this.props.setAddHumanVoiceModalVisible(true);
                                    }}>Translate</Button>
                                </Card>
                            </Grid.Column>
                        )
                    })}
                    {this._renderAddHumanVoiceModal()}
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
    addHumanVoiceModalVisible: organizationVideos.addHumanVoiceModalVisible,
    selectedVideo: organizationVideos.selectedVideo,
    videosLoading: organizationVideos.videosLoading,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: ({ organization, langCode, status }) => dispatch(videoActions.fetchVideos({ organization, langCode, status })),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setAddHumanVoiceModalVisible: visible => dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Translations));