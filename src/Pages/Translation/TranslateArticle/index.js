import React from 'react';
import Tabs from '../../../shared/components/Tabs';
import Workstation from './TabsContent/Workstation';
import Comments from './TabsContent/Comments';
import ExportHistory from './TabsContent/ExportHistory';

class TranslateArticle extends React.Component {
    state = {
        pollerStarted: false,
        currentTabIndex: 0,
    }
    
    renderTabContent = () => {
        let comp;
        switch(this.state.currentTabIndex) {
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
                    activeIndex={this.state.currentTabIndex}
                    onActiveIndexChange={val => this.setState({ currentTabIndex: val })}
                />
                {this.renderTabContent()}
            </div>
        )
    }
}

export default TranslateArticle;