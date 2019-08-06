import React from 'react';
import { connect } from 'react-redux';

import Tabs from '../../../shared/components/Tabs';
import Workstation from './TabsContent/Workstation';
import Comments from './TabsContent/Comments';
import ExportHistory from './TabsContent/ExportHistory';

import { setActiveTabIndex } from './modules/actions';

class TranslateArticle extends React.Component {
    
    renderTabContent = () => {
        let comp;
        switch(this.props.activeTabIndex) {
            case 0:
                comp = <Workstation />; break;
            case 1:
                comp = <Comments />;break;
            case 2:
                comp = <ExportHistory />; break;
            default:
                comp = <Workstation />; break;
        }
        return (
            <div style={{ width: '100%', marginTop: '2rem' }}>
                {comp}
            </div>
        )
    }


    render() {

        return (

            <div style={{ width: '100%' }}>
                <Tabs
                    items={[{ title: 'Workstation' }, { title: 'Comments' }, { title: 'Export History' }]}
                    activeIndex={this.props.activeTabIndex}
                    onActiveIndexChange={val => this.props.setActiveTabIndex(val)}
                />
                {this.renderTabContent()}
            </div>
        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    activeTabIndex: translateArticle.activeTabIndex,
})

const mapDispatchToProps = (dispatch) => ({
    setActiveTabIndex: index => dispatch(setActiveTabIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticle);