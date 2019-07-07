import React from 'react';
import VideoTimeline from '../shared/components/VideoTimeline';

export default class Test extends React.Component {
    state = {
        currentTime: 0,
        duration: 10 * 60 * 1000,
        slides: [{ text: 'hello world', startTime: 1000, endTime: 12000 }]
        // slides: [{ text: 'hello world', startTime: (10 * 60 * 60 * 1000) - 2000, endTime: 10 * 60 * 60 * 1000 }]
    }
    componentDidMount = () => {
        // setInterval(() => {
        //     this.setState(({ currentTime }) => {
        //         return ({ currentTime: currentTime + 50 });
        //     })
        // }, 50);
    }
    onTimeChange = (currentTime) => {
        // console.log(currentTime)
        this.setState({ currentTime });
    }
    onSlidesChange = (slides) => {
        this.setState({ slides });
    }
    render() {
        return (
            <VideoTimeline
                currentTime={this.state.currentTime}
                onTimeChange={this.onTimeChange}
                duration={this.state.duration}
                slides={this.state.slides}   
                onSlidesChange={this.onSlidesChange} 
            />
        )
    }
}