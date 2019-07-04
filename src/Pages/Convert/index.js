import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Progress } from 'semantic-ui-react';

import * as videoActions from '../../actions/video';
import ProgressBoxes from '../../shared/components/ProgressBoxes';


function generateStages() {
    return [{
        title: <div>Step 1: Transcribing Video</div>,
        completed: false,
        active: false,
    },
    {
        title: <div>Step 1: Proof Reading Script</div>,
        completed: false,
        active: false,
    },
    {
        title: <div>Step 1: Converting to a VideoWiki<br />video</div>,
        completed: false,
        active: false,
    }]
}

class Convert extends React.Component {

    state = {
        stages: [],
        intervalId: null,
    }

    componentWillMount() {
        const { videoId } = this.props.match.params;
        this.props.fetchVideoById(videoId);
        const intervalId = setInterval(() => {
            this.props.fetchVideoById(videoId);
        }, 10000);
        this.setState({ intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fetchVideoState === 'loading' && nextProps.fetchVideoState === 'done') {
            const { video } = nextProps;
            const stages = generateStages();
            switch (video.status) {
                case 'proofreading':
                    stages[0].completed = true;
                    stages[1].active = true;
                    break;
                case 'converting':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].active = true;
                    break;
                case 'failed':
                    this.onVideoFailed(video); break;
                case 'done':
                    this.onVideoDone(video); break;
                default:
                    stages[0].active = true;
            }
            this.setState({ stages });
        }
    }

    onVideoFailed(video) {
        clearInterval(this.state.intervalId);
    }

    onVideoDone(video) {
        clearInterval(this.state.intervalId)
    }

    getVideoStatus = () => {
        if (this.props.video && this.props.video.status) return this.props.video.status;
        return null;
    }

    getProgress = () => {
        return parseInt(this.state.stages.filter(stage => stage.completed).length / this.state.stages.length * 100);
    }

    render() {
        return (
            <div>
                {this.getVideoStatus() !== 'failed' ? (
                    <div>
                        <ProgressBoxes stages={this.state.stages} />
                        <div style={{ width: '90%', margin: '2rem auto' }}>
                            <Progress indicating progress percent={this.getProgress()} />
                        </div>

                    </div>
                ) : (
                    <div>
                        Something went wrong while converting the video, please try again.
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ video }) => ({
    video: video.video,
    fetchVideoState: video.fetchVideoState,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideoById: (id) => dispatch(videoActions.fetchVideoById(id))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Convert)
);