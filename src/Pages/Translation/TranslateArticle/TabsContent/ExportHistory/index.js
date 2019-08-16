import React from 'react';
import { Grid, Card, Progress, Pagination, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

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
        this.props.setExportHistoryPageNumber(1);
    }

    onPageChange = (e, { activePage }) => {
        this.props.setExportHistoryPageNumber(activePage);
        this.props.fetchTranslationExports(activePage, true);
    }

    onDeclineRequest = translationExport => {
        this.props.declineTranslationExport(translationExport._id);
    }

    onApproveRequest = translationExport => {
        this.props.approveTranslationExport(translationExport._id)
    }

    canApprove = () => {
        const userRole = this.props.user.organizationRoles.find((r) => r.organization._id === this.props.organization._id)
        return userRole && (userRole.organizationOwner || userRole.permissions.indexOf('admin') !== -1);
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
        return (
            <LoaderComponent active={this.props.loading}>
                <div>
                    <Grid>
                        {(!this.props.translationExports || this.props.translationExports.length === 0) && (
                            <Grid.Row>
                                <Grid.Column>
                                    No exports are available here
                                    </Grid.Column>
                            </Grid.Row>
                        )}
                        {this.props.translationExports && _.chunk(this.props.translationExports, 3).map((translationExportChunk, index) => (
                            <Grid.Row key={`translation-export-chunk-${index}`} >
                                {translationExportChunk.map((translationExport) => (
                                    <Grid.Column width={5} key={translationExport._id}>
                                        <Card fluid>
                                            <Card.Content>
                                                <video width={'100%'} controls src={translationExport.videoUrl} />
                                            </Card.Content>

                                            <Card.Content>
                                                <p>Status: {'\t'}
                                                    {translationExport.exportRequestStatus === 'declined' && <span>Declined</span>}
                                                    {translationExport.exportRequestStatus === 'pending' && (<span>Pending approval</span>)}
                                                    {translationExport.exportRequestStatus === 'approved' && translationExport.status}
                                                </p>
                                                {translationExport.exportRequestStatus === 'approved' && (
                                                    <Progress progress indicating percent={translationExport.progress} />
                                                )}
                                                <p>Created at: {moment(translationExport.created_at).format('hh:mm a DD/MM/YYYY')}</p>
                                            </Card.Content>


                                            {this.canApprove() && translationExport.exportRequestStatus === 'pending' && (
                                                <Card.Content>
                                                    <div className='pull-right'>
                                                        <Button color="red" onClick={() => this.onDeclineRequest(translationExport)}>
                                                            Decline
                                                            </Button>
                                                        <Button color="blue" onClick={() => this.onApproveRequest(translationExport)}>
                                                            Approve
                                                            </Button>
                                                    </div>
                                                </Card.Content>
                                            )}

                                        </Card>
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                        ))}
                        {this.renderPagination()}
                    </Grid>
                </div>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ translateArticle, authentication, organization }) => ({
    translationExports: translateArticle.translationExports,
    exportHistoryCurrentPageNumber: translateArticle.exportHistoryCurrentPageNumber,
    exportHistoryTotalPages: translateArticle.exportHistoryTotalPages,
    loading: translateArticle.loading,
    organization: organization.organization,
    user: authentication.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchTranslationExports: (loading) => dispatch(translateArticleActions.fetchTranslationExports(loading)),
    setExportHistoryPageNumber: pageNumber => dispatch(translateArticleActions.setExportHistoryPageNumber(pageNumber)),
    approveTranslationExport: (translationExportId) => dispatch(translateArticleActions.approveTranslationExport(translationExportId)),
    declineTranslationExport: (translationExportId) => dispatch(translateArticleActions.declineTranslationExport(translationExportId)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory); 