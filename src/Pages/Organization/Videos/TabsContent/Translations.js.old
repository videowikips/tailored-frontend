import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { Grid, Card, Dropdown, Button, Pagination } from 'semantic-ui-react';

import * as videoActions from '../modules/actions';
import routes from '../../../../shared/routes';
import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import AddHumanVoiceModal from '../../../../shared/components/AddHumanVoiceModal';
import LoaderComponent from '../../../../shared/components/LoaderComponent';
import authorizeUser from '../../../../shared/hoc/authorizeUser';

let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));

const videoSTATUS = ['done'];
class Translations extends React.Component {
    componentWillMount() {
        this.props.setCurrentPageNumber(1);
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: videoSTATUS, page: 1 });
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: this.props.languageFilter, status: videoSTATUS, page: activePage });
    }

    renderPagination = () => (
        <Grid.Row>
            <Grid.Column width={10} />
            <Grid.Column width={6}>
                <Pagination
                    activePage={this.props.currentPageNumber}
                    onPageChange={this.onPageChange}
                    totalPages={this.props.totalPagesCount}
                />
            </Grid.Column>
        </Grid.Row>
    )
    onAddHumanVoice = lang => {
        this.props.setAddHumanVoiceModalVisible(false);
        this.props.history.push(routes.translationArticle(this.props.selectedVideo.article) + `?lang=${lang}`);
    }

    onLanguageFilterChange = (e, {value}) => {
        this.props.setLanguageFilter(value)
        this.props.setCurrentPageNumber(1);
        this.props.fetchVideos({ organization: this.props.organization._id, langCode: value, status: videoSTATUS, page: 1 });
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
                            onChange={this.onLanguageFilterChange}
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
                    {this.renderPagination()}
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
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setAddHumanVoiceModalVisible: visible => dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(authorizeUser(Translations, ['admin', 'translate'])));