import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Card, Progress, Button, Pagination } from 'semantic-ui-react';

import LoaderComponent from '../../../../shared/components/LoaderComponent';

import { isoLangs, supportedLangs } from '../../../../shared/constants/langs';
import routes from '../../../../shared/routes';

import * as videoActions from '../modules/actions';
import authorizeUser from '../../../../shared/hoc/authorizeUser';

class Translated extends React.Component {
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

    render() {
        return (
            <LoaderComponent active={this.props.videosLoading}>
                <Grid style={{ textAlign: 'center' }}>
                    {this.props.translatedArticles.map((translatedArticle) => (
                        <Grid.Row key={`translated-article-container-${translatedArticle.video._id}`}>
                            <Grid.Column width={16} style={{ textAlign: 'left', margin: '1rem' }}>
                                <h3>{translatedArticle.video.title}</h3>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Card fluid>
                                    <video src={translatedArticle.video.url} width="100%" height="100%" controls preload="false" />
                                    <Card.Content>
                                        <Link to={routes.organizationArticle(translatedArticle.video.article)}>
                                            Original {this.getLanguage(translatedArticle.video.langCode)}
                                        </Link>
                                        <p>Number of speakers {translatedArticle.video.numberOfSpeakers}</p>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Grid>
                                    <Grid.Row>
                                        {translatedArticle.articles.map((article) => (
                                            <Grid.Column width={6} key={`translated-article-article-${article._id}`}>
                                                <Card fluid>
                                                    <Card.Header style={{ padding: '1rem', fontWeight: 'bold' }}>
                                                        <Link to={routes.translationArticle(translatedArticle.video.article) + `?lang=${article.langCode}`}>
                                                            {article.title} ( {isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode} )
                                                            </Link>
                                                    </Card.Header>
                                                    <Card.Content>
                                                        <Link to={routes.translationArticle(translatedArticle.video.article, article.langCode)}>
                                                            <Button color="blue">
                                                                {article.metrics.completed.total}% Completed
                                                                </Button>
                                                        </Link>
                                                        <h3 style={{ marginTop: '1rem' }}>Voice translations</h3>
                                                        {article.metrics.speakersMetrics.map(speakerMetric => (
                                                            <div key={`speaker-voice-metric-${speakerMetric.speaker.speakerNumber}`}>
                                                                <p>Speaker {speakerMetric.speaker.speakerNumber} ( {speakerMetric.speaker.speakerGender} )</p>
                                                                <Progress progress indicating percent={speakerMetric.progress} style={{ marginTop: '0.5rem' }} />
                                                            </div>
                                                        ))}
                                                        <h3 style={{ marginTop: '1rem' }}>Text translations</h3>
                                                        <Progress progress indicating percent={article.metrics.completed.text} />
                                                    </Card.Content>
                                                </Card>
                                            </Grid.Column>
                                        ))}
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    ))}
                    {this.renderPagination()}
                </Grid>
            </LoaderComponent>
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
    currentPageNumber: organizationVideos.currentPageNumber,
})
const mapDispatchToProps = (dispatch) => ({
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    fetchTranslatedArticles: (organization, page) => dispatch(videoActions.fetchTranslatedArticles(organization, page))
})

export default connect(mapStateToProps, mapDispatchToProps)(authorizeUser(Translated, ['admin']));
