import React from 'react';
import { connect } from 'react-redux';
import { Grid, Card, Progress, Button, Pagination } from 'semantic-ui-react';

import LoaderComponent from '../../../shared/components/LoaderComponent';

import { isoLangs, supportedLangs } from '../../../shared/constants/langs';

import * as actions from './modules/actions';
// import authorizeUser from '../../../../shared/hoc/authorizeUser';
import authorizeUser from '../../../shared/hoc/authorizeUser';

class Archive extends React.Component {
    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
        this.props.fetchArchivedTranslatedArticles(this.props.organization._id, 1);
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
        this.props.fetchArchivedTranslatedArticles(this.props.organization._id, activePage);
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
                    {this.props.archivedTranslatedArticles.map((translatedArticle) => (
                        <Grid.Row key={`translated-article-container-${translatedArticle.video._id}`}>
                            <Grid.Column width={16} style={{ textAlign: 'left', margin: '1rem' }}>
                                <h3>{translatedArticle.video.title} <small>(archived)</small></h3>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Card fluid>
                                    <video src={translatedArticle.video.url} width="100%" height="100%" controls preload="false" />
                                    <Card.Content>
                                        <p>
                                            Original {this.getLanguage(translatedArticle.video.langCode)}
                                        </p>
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
                                                        <p>
                                                            {article.title} ( {isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode} )
                                                        </p>
                                                    </Card.Header>
                                                    <Card.Content>
                                                        <Button color="blue" disabled>
                                                            {article.metrics.completed.total}% Completed
                                                            </Button>
                                                        <h3 style={{ marginTop: '1rem' }}>Voice translations</h3>
                                                        {article.metrics.speakersMetrics.map(speakerMetric => (
                                                            <div key={`speaker-voice-metric-${article._id}-${speakerMetric.speaker.speakerNumber}`}>
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

const mapStateToProps = ({ organization, authentication, organizationArchive }) => ({
    organization: organization.organization,
    user: authentication.user,
    archivedTranslatedArticles: organizationArchive.archivedTranslatedArticles,
    // videos: organizationVideos.videos,
    // languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationArchive.loading,
    totalPagesCount: organizationArchive.totalPagesCount,
    currentPageNumber: organizationArchive.currentPageNumber,
})
const mapDispatchToProps = (dispatch) => ({
    setCurrentPageNumber: pageNumber => dispatch(actions.setCurrentPageNumber(pageNumber)),
    fetchArchivedTranslatedArticles: (organization, page) => dispatch(actions.fetchArchivedTranslatedArticles(organization, page))
})

export default connect(mapStateToProps, mapDispatchToProps)(authorizeUser(Archive, ['admin']));
