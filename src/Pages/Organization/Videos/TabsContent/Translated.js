import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Card, Progress, Button } from 'semantic-ui-react';

import LoaderComponent from '../../../../shared/components/LoaderComponent';

import { isoLangs, supportedLangs } from '../../../../shared/constants/langs';
import routes from '../../../../shared/routes';

import * as videoActions from '../modules/actions';

class Translated extends React.Component {

    componentWillMount = () => {
        this.props.fetchTranslatedArticles(this.props.organization._id);
    }

    render() {
        return (
            <LoaderComponent active={this.props.videosLoading}>
                <Grid style={{ textAlign: 'center' }}>
                    {this.props.translatedArticles.map((translatedArticle) => (
                        <Grid.Row key={`translated-article-container-${translatedArticle.video._id}`}>
                            <Grid.Column width={4}>
                                <Card fluid>
                                    <video src={translatedArticle.video.url} width="100%" height="100%" controls preload="false" />
                                    <Card.Content>
                                        <Link to={routes.organizationArticle(translatedArticle.video.article)}>
                                            Original {supportedLangs.find((l) => l.code === translatedArticle.video.langCode) ? supportedLangs.find((l) => l.code === translatedArticle.video.langCode).name : translatedArticle.video.langCode}
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
                                                    <Card.Header style={{ padding: '1rem', fontWeight: 'bold'}}>

                                                        <Link to={routes.translationArticle(translatedArticle.video.article) + `?lang=${article.langCode}`}>
                                                            {article.title} ( {isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode} )
                                                        </Link>
                                                    </Card.Header>
                                                    <Card.Content>
                                                        <Link to={routes.translationArticle(translatedArticle.video.article, article.langCode)}>
                                                            <Button color="blue">
                                                                {article.metrics.completed}% Completed
                                                            </Button>
                                                        </Link>
                                                        <p style={{ marginTop: '1rem' }}>Voice translation</p>
                                                        {article.metrics.speakersMetrics.map(speakerMetric => (
                                                            <p key={`speaker-voice-metric-${speakerMetric.speaker.speakerNumber}`}>
                                                                {speakerMetric.speaker.speakerNumber}
                                                                <Progress progress indicating percent={speakerMetric.progress} />
                                                            </p>
                                                        ))}
                                                    </Card.Content>
                                                </Card>
                                            </Grid.Column>
                                        ))}
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    ))}
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
})
const mapDispatchToProps = (dispatch) => ({
    fetchTranslatedArticles: (organization) => dispatch(videoActions.fetchTranslatedArticles(organization))
})

export default connect(mapStateToProps, mapDispatchToProps)(Translated);
