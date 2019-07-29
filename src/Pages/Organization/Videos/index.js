import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import Review from './TabsContent/Review';
import Translations from './TabsContent/Translations';
import Translated from './TabsContent/Translated';

import Tabs from '../../../shared/components/Tabs';

import * as videoActions from '../../../actions/video';

class VideosList extends React.Component {

    renderTabContent = () => {
        let comp;
        switch(this.props.organizationVideos.activeTabIndex) {
            case 0:
                comp = <Review />; break;
            case 1:
                comp = <Translations />;break;
            case 2:
                comp = <Translated />; break;
            default:
                comp = <Review />; break;
        }
        return (
            <div style={{ width: '100%', marginTop: '2rem' }}>
                {comp}
            </div>
        )
    }

    render() {
        const { organizationVideos } = this.props;
        return (
            <div style={{ width: '100%' }}>
                <Tabs 
                    items={[{ title: 'Review' }, { title: 'Translations' }, { title: 'Translated' }]} 
                    activeIndex={organizationVideos.activeTabIndex} 
                    onActiveIndexChange={val => this.props.setOrganizationVideosActiveTabIndex(val)}
                />
                {this.renderTabContent()}
            </div>
        )
    }
}

const mapStateToProps = ({ video, organization, authentication }) => ({
    organizationVideos: video.organizationVideos,
})

const mapDispatchToProps = (dispatch) => ({
    setOrganizationVideosActiveTabIndex: index => dispatch(videoActions.setOrganizationVideosActiveTabIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideosList);