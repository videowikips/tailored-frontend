import React from 'react';
import { Grid, Card, Progress } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as translateArticleActions from '../../modules/actions';
import * as pollerActions from '../../../../../actions/poller';

const FETCH_TRANSLATIONEXPORTS = 'FETCH_TRANSLATIONEXPORTS';

class ExportHistory extends React.Component {

    componentWillMount = () => {
        this.props.fetchTranslationExports();
        this.props.startJob({ jobName: FETCH_TRANSLATIONEXPORTS, interval: 10000 }, () => {
            this.props.fetchTranslationExports();
        })
    }

    componentWillUnmount = () => {
        this.props.stopJob(FETCH_TRANSLATIONEXPORTS);
    }

    render() {
        console.log(this.props.translationExports);
        return (
            <div>
                <Grid>
                    <Grid.Row>
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
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    translationExports: translateArticle.translationExports
})

const mapDispatchToProps = (dispatch) => ({
    fetchTranslationExports: () => dispatch(translateArticleActions.fetchTranslationExports()),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory); 