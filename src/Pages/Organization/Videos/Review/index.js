import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Dropdown, Pagination, Input } from 'semantic-ui-react';

import * as videoActions from '../modules/actions';
import VideosTabs from '../VideosTabs';

import authorizeUser from '../../../../shared/hoc/authorizeUser';
import Tabs from '../../../../shared/components/Tabs';
import Proofread from './TabsContent/Proofread';
import Completed from './TabsContent/Completed';
import Transcribe from './TabsContent/Transcribe';
import queryString from 'query-string';

import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import { debounce } from '../../../../shared/utils/helpers';
import RoleRenderer from '../../../../shared/containers/RoleRenderer';
let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));


class Review extends React.Component {
    state = {
        activeTab: 0,
    }

    constructor(props) {
        super(props);

        this.debouncedSearch = debounce((searchTerm) => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchVideos();
        }, 500)
    }

    componentWillMount = () => {
        const { activeTab } = queryString.parse(this.props.location.search);
        if (activeTab) {
            switch (activeTab) {
                case 'transcribe':
                    return this.setState({ activeTab: 0 });
                case 'proofread':
                    return this.setState({ activeTab: 1 });
                case 'completed':
                    return this.setState({ activeTab: 2 });
                default:
                    return this.setState({ activeTab: 0 });
            }
        }
    }

    onTabChange = index => {
        this.setState({ activeTab: index });
        this.props.setSearchFilter('');
        this.props.setCurrentPageNumber(1);
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchVideos({ organization: this.props.organization._id });
    }

    onSearchChange = (searchTerm) => {
        this.props.setSearchFilter(searchTerm);
        this.debouncedSearch()
    }

    onLanguageFilterChange = (e, { value }) => {
        this.props.setLanguageFilter(value);
        this.props.setCurrentPageNumber(1)
        this.props.fetchVideos({ organization: this.props.organization._id })
    }


    renderPagination = () => (
        <Pagination
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )

    _renderTabContent = () => {
        switch (this.state.activeTab) {
            case 0:
                return <Transcribe />
            case 1:
                return <Proofread />
            case 2:
                return <Completed />
            default:
                return <Transcribe />
        }
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <VideosTabs />
                    </Grid.Column>
                </Grid.Row>

                <RoleRenderer roles={['admin', 'review']}>
                    <Grid.Row>
                        <Grid.Column width={2} />
                        <Grid.Column width={10}>
                            <Tabs
                                items={[{ title: 'AI Transcribe' }, { title: 'Proofread' }, { title: 'Completed' }]}
                                onActiveIndexChange={(index) => this.onTabChange(index)}
                                activeIndex={this.state.activeTab}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <div className="pull-right" style={{ marginLeft: '2rem' }}>
                                {this.renderPagination()}
                            </div>
                            <Input
                                fluid
                                style={{ height: '100%' }}
                                type="text"
                                icon="search"
                                placeholder="Search"
                                value={this.props.searchFilter}
                                onChange={(e, { value }) => this.onSearchChange(value)}
                            />
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
                    {this._renderTabContent()}
                </RoleRenderer>
            </Grid>
        )
    }
}


const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
    selectedVideo: organizationVideos.selectedVideo,
    searchFilter: organizationVideos.searchFilter,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    reviewVideo: video => dispatch(videoActions.reviewVideo(video)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
    setSearchFilter: filter => dispatch(videoActions.setSearchFilter(filter)),
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));