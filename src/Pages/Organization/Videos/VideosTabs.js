import React from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '../../../shared/components/Tabs';
import routes from '../../../shared/routes';

const items = [{ title: 'Review' }, { title: 'Translations' }];

class VideosTabs extends React.Component {
    state = {
        currentTitle: '',
    }
    componentDidMount = () => {
        const { pathname } = this.props.location;
        switch(pathname) {
            case routes.organziationTranslations():
                this.setState({ currentTitle: 'Translations' });break;
            case routes.organziationReview():
                this.setState({ currentTitle: 'Review' }); break;
            default:
                this.setState({ currentTitle: 'Review' }); break;
        }
    }
    onActiveIndexChange = (val) => {
        this.setState({currentTitle: items[val].title})
        switch(val) {
            case 0:
                return this.props.history.push(routes.organziationReview());

            case 1:
                this.props.history.push(routes.organziationTranslations());
                return;
            default:
                break;
        }        
    }

    render() {
        return (
            <Tabs
                items={items}
                activeIndex={items.map((i) => i.title).indexOf(this.state.currentTitle)}
                onActiveIndexChange={val => this.onActiveIndexChange(val)}
            />
        )
    }
}


export default withRouter(VideosTabs);
