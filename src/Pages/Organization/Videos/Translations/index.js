import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Card, Progress, Button, Pagination, Modal } from 'semantic-ui-react';

import LoaderComponent from '../../../../shared/components/LoaderComponent';

import { isoLangs, supportedLangs } from '../../../../shared/constants/langs';
import routes from '../../../../shared/routes';

import * as videoActions from '../modules/actions';
import AddHumanVoiceModal from '../../../../shared/components/AddHumanVoiceModal';
import VideosTabs from '../VideosTabs';
import RoleRenderer from '../../../../shared/containers/RoleRenderer';
import ArticleSummaryCard from '../../../../shared/components/ArticleSummaryCard';

class Translated extends React.Component {
    state = {
        deletedArticle: null,
        deleteArticleModalVisible: false,
    }
    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
        this.props.fetchTranslatedArticles(this.props.organization._id, 1);
    }

    getLanguage = langCode => {
        const fromOthers = isoLangs[langCode];
        if (fromOthers) return fromOthers.name;
        const fromSupported = supportedLangs.find(l => l.code === langCode);
        if (fromSupported) return fromSupported.name;
        return langCode
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchTranslatedArticles(this.props.organization._id, activePage);
    }

    onAddHumanVoice = lang => {
        this.props.setAddHumanVoiceModalVisible(false);
        this.props.history.push(routes.translationArticle(this.props.selectedVideo.article) + `?lang=${lang}`);
    }

    onDeleteArticleClick = (article) => {
        this.setState({ deletedArticle: article, deleteArticleModalVisible: true });
    }

    deleteSelectedArticle = () => {
        this.props.deleteArticle(this.state.deletedArticle._id);
        this.setState({ deleteArticle: null, deleteArticleModalVisible: false });
    }

    _renderDeleteArticleModal = () => (
        <Modal open={this.state.deleteArticleModalVisible} size="tiny">
            <Modal.Header>
                Delete Translation
            </Modal.Header>
            <Modal.Content>
                Are you sure you want to delete this translation?
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={() => this.setState({ deleteArticleModalVisible: false, deletedArticle: null })}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    onClick={this.deleteSelectedArticle}
                >
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )

    renderPagination = () => (
        <Pagination
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )


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

    render() {
        return (
            <Grid style={{ textAlign: 'center' }}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <VideosTabs />
                    </Grid.Column>
                </Grid.Row>
                <RoleRenderer roles={['admin', 'translate']}>
                    <LoaderComponent active={this.props.videosLoading}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <div className="pull-right">
                                    {this.renderPagination()}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        {this.props.translatedArticles.map((translatedArticle) => (
                            <Grid.Row key={`translated-article-container-${translatedArticle.video._id}`}>
                                <Grid.Column width={4}>

                                    <Card fluid style={{ marginTop: -15 }}>
                                        <Card.Content>
                                            <Link to={routes.organizationArticle(translatedArticle.video.article)}>
                                                <h3>{translatedArticle.video.title}</h3>
                                            </Link>
                                        </Card.Content>
                                        <video src={translatedArticle.video.url} width="100%" height="100%" controls preload="false" />
                                        <Button fluid color="blue" onClick={() => {
                                            this.props.setSelectedVideo(translatedArticle.video);
                                            this.props.setAddHumanVoiceModalVisible(true);
                                        }}>Translate</Button>
                                    </Card>

                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Grid>
                                        {translatedArticle.articles && translatedArticle.articles.length > 0 && (
                                            <Grid.Row style={{ maxHeight: 400, overflowY: 'scroll', border: '2px solid #eee', padding: 20 }}>
                                                {translatedArticle.articles.map((article) => (
                                                    <Grid.Column width={8} key={`translated-article-article-${article._id}`} style={{ marginBottom: 20 }}>
                                                        <ArticleSummaryCard
                                                            article={article}
                                                            lang={isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode}
                                                            onTitleClick={() => this.props.history.push(routes.translationArticle(translatedArticle.video.article) + `?lang=${article.langCode}`)}
                                                            onDeleteClick={() => this.onDeleteArticleClick(article)}
                                                        />
                                                    </Grid.Column>
                                                ))}
                                            </Grid.Row>
                                        )}
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        ))}

                        {this._renderAddHumanVoiceModal()}
                        {this._renderDeleteArticleModal()}
                    </LoaderComponent>
                </RoleRenderer>
            </Grid>
        )
    }
}

const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    translatedArticles: organizationVideos.translatedArticles,
    videos: organizationVideos.videos,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    selectedVideo: organizationVideos.selectedVideo,
    addHumanVoiceModalVisible: organizationVideos.addHumanVoiceModalVisible,
    currentPageNumber: organizationVideos.currentPageNumber,
})
const mapDispatchToProps = (dispatch) => ({
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setAddHumanVoiceModalVisible: visible => dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    fetchTranslatedArticles: (organization, page) => dispatch(videoActions.fetchTranslatedArticles(organization, page)),
    deleteArticle: (articleId) => dispatch(videoActions.deleteArticle(articleId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Translated));
