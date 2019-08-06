import React from 'react';
import { Grid, Card, Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as translateArticleActions from '../../modules/actions';
import * as pollerActions from '../../../../../actions/poller';

const FETCH_TRANSLATIONEXPORTS = 'FETCH_TRANSLATIONEXPORTS';

class ExportHistory extends React.Component {

    componentWillMount = () => {
        this.props.fetchTranslationExports(true);
        this.props.startJob({ jobName: FETCH_TRANSLATIONEXPORTS, interval: 10000 }, () => {
            this.props.fetchTranslationExports(false);
        })
    }

    componentWillUnmount = () => {
        this.props.stopJob(FETCH_TRANSLATIONEXPORTS);
    }

    render() {
        console.log(this.props.translationExports);
        return (
            <LoaderComponent active={this.props.loading}>
                <div>
                    <Grid>
                        <Grid.Row>
                            {(!this.props.translationExports || this.props.translationExports.length === 0) && (
                                <Grid.Column>
                                    No exports have been created yet
                                </Grid.Column>
                            )}
                            {this.props.translationExports && this.props.translationExports.map((translationExport) => (
                                <Grid.Column width={6} key={translationExport._id}>
                                    <Card fluid>
                                        <Card.Content>
                                            <video width={'100%'} controls src={translationExport.videoUrl} />
                                        </Card.Content>
                                        <Card.Content>
                                            <p>Status: {translationExport.status}</p>
                                            <Progress progress indicating percent={translationExport.progress} />
                                            <p>Created at: {translationExport.created_at}</p>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    </Grid>
                </div>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    translationExports: translateArticle.translationExports,
    loading: translateArticle.loading,
})

const mapDispatchToProps = (dispatch) => ({
    fetchTranslationExports: (loading) => dispatch(translateArticleActions.fetchTranslationExports(loading)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory); 