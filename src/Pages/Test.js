import React from 'react';
import VideoTimeline from '../shared/components/VideoTimeline';

export default class Test extends React.Component {
    state = {
        currentTime: 0,
        duration: 10 * 60 * 1000,
        subtitles: [{ text: 'hello world', startTime: 1000, endTime: 5000, backgroundColor: 'blue', color: 'white' },
        { text: 'hello there', startTime: 6000, endTime: 9000, backgroundColor: 'blue', color: 'white' }]
        // subtitles: [{ text: 'hello world', startTime: (10 * 60 * 60 * 1000) - 2000, endTime: 10 * 60 * 60 * 1000 }]
    }

    componentDidMount = () => {
        // setInterval(() => {
        //     this.setState(({ currentTime }) => {
        //         return ({ currentTime: currentTime + 50 });
        //     })
        // }, 50);
    }

    componentWillUnmount = () => {
        if (this.vidoeRef) {
            this.vidoeRef.ontimeupdate = null;
        }
    }

    onTimeChange = (currentTime) => {
        this.vidoeRef.currentTime = currentTime / 1000;
        this.setState({ currentTime });
    }

    onSubtitlesChange = (subtitles) => {
        this.setState({ subtitles });
    }

    onVideoLoad = (e) => {
        if (this.vidoeRef) {
            this.vidoeRef.ontimeupdate = () => {
                this.setState({ currentTime: this.vidoeRef.currentTime * 1000 });
            }
            this.setState({ duration: this.vidoeRef.duration * 1000 })
        }
    }

    render() {
        return (
            <div>
                <video src={'public/1.mp4'} controls ref={(ref) => this.vidoeRef = ref} onLoadedData={this.onVideoLoad} />
                <VideoTimeline
                    currentTime={this.state.currentTime}
                    onTimeChange={this.onTimeChange}
                    duration={this.state.duration}
                    subtitles={this.state.subtitles}
                    onSubtitlesChange={this.onSubtitlesChange}
                    onSubtitleSelect={(subtitle, index) => console.log('on subtitle select', subtitle, index)}
                />
            </div>
        )
    }
}
