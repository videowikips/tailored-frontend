import React from 'react';
import { Grid, Card, Progress, Pagination } from 'semantic-ui-react';
import { connect } from 'react-redux';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as translateArticleActions from '../../modules/actions';
import * as pollerActions from '../../../../../actions/poller';

const FETCH_TRANSLATIONEXPORTS = 'FETCH_TRANSLATIONEXPORTS';

class ExportHistory extends React.Component {

    componentWillMount = () => {
        this.props.setExportHistoryPageNumber(1);
        this.props.fetchTranslationExports(this.props.exportHistoryCurrentPageNumber, true);
        this.props.startJob({ jobName: FETCH_TRANSLATIONEXPORTS, interval: 10000 }, () => {
            this.props.fetchTranslationExports(this.props.exportHistoryCurrentPageNumber, false);
        })
    }

    componentWillUnmount = () => {
        this.props.stopJob(FETCH_TRANSLATIONEXPORTS);
    }
    
    onPageChange = (e, { activePage }) => {
        this.props.setExportHistoryPageNumber(activePage);
        this.props.fetchTranslationExports(activePage, true);
    }

    renderPagination = () => (
        <Grid.Row>
            <Grid.Column width={10} />
            <Grid.Column width={6}>
                <Pagination
                    activePage={this.props.exportHistoryCurrentPageNumber}
                    onPageChange={this.onPageChange}
                    totalPages={this.props.exportHistoryTotalPages}
                />
            </Grid.Column>
        </Grid.Row>
    )

    render() {
        console.log(this.props.translationExports);
        return (
            <LoaderComponent active={this.props.loading}>
                <div>
                    <Grid>
                        <Grid.Row>
                            {(!this.props.translationExports || this.props.translationExports.length === 0) && (
                                <Grid.Column>
                                    No exports are available here
                                </Grid.Column>
                            )}
                            {this.props.translationExports && this.props.translationExports.map((translationExport) => (
                                <Grid.Column width={5} key={translationExport._id}>
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
                        {this.renderPagination()}
                    </Grid>
                </div>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    translationExports: translateArticle.translationExports,
    exportHistoryCurrentPageNumber: translateArticle.exportHistoryCurrentPageNumber,
    exportHistoryTotalPages: translateArticle.exportHistoryTotalPages,
    loading: translateArticle.loading,
})

const mapDispatchToProps = (dispatch) => ({
    fetchTranslationExports: (loading) => dispatch(translateArticleActions.fetchTranslationExports(loading)),
    setExportHistoryPageNumber: pageNumber => dispatch(translateArticleActions.setExportHistoryPageNumber(pageNumber)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory); 