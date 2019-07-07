import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Progress } from 'semantic-ui-react';

import * as articleActions from '../../actions/article';
import * as videoActions from '../../actions/video';
import ProgressBoxes from '../../shared/components/ProgressBoxes';
import Proofreading from '../../shared/components/Proofreading';

function generateStages() {
    return [{
        title: <div>Step 1: Transcribing Video</div>,
        completed: false,
        active: false,
    },
    {
        title: <div>Step 2: Proof Reading Script</div>,
        completed: false,
        active: false,
    },
    {
        title: <div>Step 3: Converting to a VideoWiki<br />video</div>,
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
        this.startPoller();
    }

    componentWillUnmount() {
        this.stopPoller();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fetchVideoState === 'loading' && nextProps.fetchVideoState === 'done') {
            const { video } = nextProps;
            const stages = generateStages();
            switch (video.status) {
                case 'proofreading':
                    stages[0].completed = true;
                    stages[1].active = true;
                    this.props.fetchArticleByVideoId(video._id);
                    this.stopPoller();
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

    startPoller = () => {
        const { videoId } = this.props.match.params;
        this.props.fetchVideoById(videoId);
        const intervalId = setInterval(() => {
            this.props.fetchVideoById(videoId);
        }, 10000);
        this.setState({ intervalId });
    }

    stopPoller = () => {
        clearInterval(this.state.intervalId);
    }

    onVideoFailed(video) {
        this.stopPoller()
    }

    onVideoDone(video) {
        this.stopPoller();
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
                {this.getVideoStatus() === 'proofreading' && (
                    <div>
                        <Proofreading video={this.props.video} article={this.props.article} />
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ video, article }) => ({
    video: video.video,
    fetchVideoState: video.fetchVideoState,
    article: article.article,
    fetchArticleState: article.fetchArticleState,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideoById: (id) => dispatch(videoActions.fetchVideoById(id)),
    fetchArticleByVideoId: id => dispatch(articleActions.fetchArticleByVideoId(id)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Convert)
);