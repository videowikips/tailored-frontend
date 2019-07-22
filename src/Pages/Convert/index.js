import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Progress, Grid, Card, Dropdown, Button, Icon, Modal } from 'semantic-ui-react';

import * as articleActions from '../../actions/article';
import * as videoActions from '../../actions/video';
import ProgressBoxes from '../../shared/components/ProgressBoxes';
import VideoTimeline from '../../shared/components/VideoTimeline';
import SubtitleForm from './SubtitleForm';
import { SPEAKER_BACKGROUND_COLORS } from '../../shared/constants';
import Lottie from 'react-lottie';
import successLottie from '../../shared/lottie/success.json';
import loadingLottie from '../../shared/lottie/loading.json';
import { formatTime } from '../../shared/utils/helpers';
import ProofreadingVideoPlayer from './ProofreadingVideoPlayer';
import SplitterIcon from '../../shared/components/SplitterIcon';
import SpeakerDragItem from './SpeakerDragItem';

class Convert extends React.Component {

    state = {
        stages: [],
        videoPlaying: false,
        controlsVisible: false,
        duration: 0,
        intervalId: null,
        currentTime: 0,
        subtitles: [],
        selectedSubtitle: null,
        splitterDragging: false,
        selectedSubtitleIndex: null,
        isConfirmConvertModalVisible: false,
    }

    componentDidMount = () => {
        // setInterval(() => {
        //     this.setState(({ currentTime }) => {
        //         return ({ currentTime: currentTime + 50 });
        //     })
        // }, 50);
    }

    componentWillUnmount = () => {
        if (this.videoRef) {
            this.videoRef.ontimeupdate = null;
            this.videoRef.onended = null;
        }
    }

    onTimeChange = (currentTime) => {
        this.videoRef.currentTime = currentTime / 1000;
        this.setState({ currentTime });
    }

    onSubtitleChange = (subtitle, subtitleIndex, changes) => {
        console.log('onSubtitleChange')
        // this.props.onSaveSubtitle(subtitle, index)
        // this.props.setSubtitles(subtitles);
        const { slideIndex, subslideIndex } = subtitle;
        this.props.updateSubslide(slideIndex, subslideIndex, subtitle);
    }

    onVideoLoad = (e) => {
        if (this.videoRef) {
            this.videoRef.ontimeupdate = () => {
                this.setState({ currentTime: this.videoRef.currentTime * 1000 });
            }
            this.videoRef.onended = () => {
                this.setState({ videoPlaying: false });
            }
            this.setState({ duration: this.videoRef.duration * 1000 })
        }
    }


    componentWillMount() {
        this.startPoller();
        this.props.fetchArticleByVideoId(this.props.match.params.videoId);
    }

    componentWillUnmount() {
        this.stopPoller();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeStageIndex !== nextProps.activeStageIndex) {
            const { video, activeStageIndex } = nextProps;
            // this.onConvertVideo()
            if (activeStageIndex === 1) {

                this.props.fetchArticleByVideoId(video._id);
                this.stopPoller();
            } else if (activeStageIndex === 2) {
                this.startPoller();
            }
            if (video) {
                switch (video.status) {
                    case 'failed':
                        this.onVideoFailed(video); break;
                    case 'done':
                        this.onVideoDone(video); break;
                    default:
                        break;
                }
            }
        }
        if (this.props.fetchArticleState === 'loading' && nextProps.fetchArticleState === 'done' && nextProps.article) {
            const { slides } = nextProps.article;
            this.props.setSlidesToSubtitles(slides);
        }
    }

    startPoller = () => {
        const { videoId } = this.props.match.params;
        // const videoId = '5d1d9b007e2a29705e0f2f11'
        this.props.fetchVideoById(videoId);
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
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
        setTimeout(() => {
            console.log('Navigating to article')
            if (this.props.article) {
                this.props.history.push(`/organization/article/${this.props.article._id}`)
            }
        }, 2500);
    }

    onSaveSubtitle = (subtitle, subtitleIndex, changes) => {
        const { slideIndex, subslideIndex } = subtitle;
        this.props.updateSubslide(slideIndex, subslideIndex, changes);
    }

    onAddSubtitle = (subtitle) => {
        this.props.addSubslide(subtitle);
    }

    onSubslideDelete = (subtitle, subtitleIndex) => {
        const { slideIndex, subslideIndex } = subtitle;
        console.log(subtitle, subtitleIndex)
        this.props.onDeleteSubslide(slideIndex, subslideIndex);
    }

    onSubtitleSplit = (subtitle, wordIndex) => {
        const { slideIndex, subslideIndex } = subtitle;
        console.log(slideIndex, subslideIndex, wordIndex)
        this.props.onSplitSubslide(slideIndex, subslideIndex, wordIndex)
    }

    onSpeakerGenderChange = (speaker, gender) => {
        const speakers = this.props.article.speakersProfile;
        const speakerIndex = speakers.findIndex((s) => s.speakerNumber === speaker.speakerNumber);
        speakers[speakerIndex].speakerGender = gender;

        this.props.onSpeakersChange(speakers);
    }

    onAddSpeaker = () => {
        const { speakersProfile } = this.props.article;
        speakersProfile.push({ speakerNumber: speakersProfile.length + 1, speakerGender: 'male' });
        this.props.onSpeakersChange(speakersProfile)
    }

    onDeleteSpeaker = (index) => {
        const { speakersProfile } = this.props.article;
        speakersProfile.splice(index, 1);
        this.props.onSpeakersChange(speakersProfile);
    }

    onPlayToggle = () => {
        this.setState(({ videoPlaying }) => {
            const newPlaying = !videoPlaying;
            if (newPlaying) {
                this.videoRef.play();
            } else {
                this.videoRef.pause();
            }

            return { videoPlaying: newPlaying };
        })
    }

    getVideoStatus = () => {
        if (this.props.video && this.props.video.status) return this.props.video.status;
        return null;
    }

    getProgress = () => {
        return parseInt(this.props.stages.filter(stage => stage.completed).length / this.props.stages.length * 100);
    }

    renderProgress = () => {
        return (
            <div style={{ backgroundColor: '#424650', padding: '2rem', width: '100%' }}>
                {this.getVideoStatus() !== 'failed' && this.props.stages ? (
                    <React.Fragment>
                        <ProgressBoxes stages={this.props.stages} />
                        <div style={{ width: '90%', margin: '2rem auto' }}>
                            <Progress indicating progress percent={this.getProgress()} />
                        </div>
                    </React.Fragment>
                ) : (
                        <div>
                            Something went wrong while converting the video, please try again.
                        </div>
                    )
                }
            </div>
        );
    }

    onConvertVideo = () => {
        this.setState({ isConfirmConvertModalVisible: false });
        this.props.convertVideoToArticle(this.props.video._id)
    }

    renderConvertConfirmModal = () => {
        return (
            <Modal open={this.state.isConfirmConvertModalVisible} onClose={() => this.setState({ isConfirmConvertModalVisible: false })} size="tiny">
                <Modal.Header>
                    Convert vidoe
                </Modal.Header>
                <Modal.Content>
                    Are you sure you're done proofreading?
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({ isConfirmConvertModalVisible: false })} >Cancel</Button>
                    <Button color="blue" onClick={() => this.onConvertVideo()} >Yes</Button>
                </Modal.Actions>
            </Modal>
        )
    }


    renderInstructions = () => {
        return (
            <div
                style={{ padding: '2rem', marginLeft: '1rem' }}
            >
                <h2>Instructions:</h2>
                <ol style={{ fontSize: 20 }}>
                    {['step 1', 'step 2', 'step 3'].map((s) => (
                        <li style={{ paddingBottom: 10 }} key={'step' + s} >{s}</li>
                    ))}
                </ol>
            </div>
        );
    }

    renderProofreading = () => {
        return (
            <div className="proofreading" style={{ width: '100%' }}>
                <Grid style={{ marginLeft: 0 }}>
                    <Grid.Row>
                        <Grid.Column width={16} style={{ padding: 0, backgroundColor: '#30343f' }}>
                            <Grid style={{ marginLeft: 0 }}>
                                <div style={{ width: '90%', margin: '2rem auto', justifyContent: 'flex-end', display: 'flex', }}>

                                    {this.renderConvertConfirmModal()}
                                    <Button color="green" onClick={() => this.setState({ isConfirmConvertModalVisible: true })} >
                                        Save and Convert <Icon name={"arrow right"} />
                                    </Button>
                                </div>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Grid style={{ display: 'flex', justifyContent: 'center', marginBottom: '.2rem' }}>
                                            <Grid.Row>
                                                <Grid.Column width={16}>
                                                    <div style={{ width: '100%', height: '100%' }}>
                                                        {this.props.video && (
                                                            <ProofreadingVideoPlayer
                                                                duration={this.state.duration}
                                                                currentTime={this.state.currentTime}
                                                                onVideoLoad={this.onVideoLoad}
                                                                playing={this.state.videoPlaying}
                                                                onTimeChange={this.onTimeChange}
                                                                videoRef={(ref) => this.videoRef = ref}
                                                                url={this.props.video.url}
                                                                onPlayToggle={this.onPlayToggle}
                                                            />
                                                        )}
                                                    </div>
                                                </Grid.Column>

                                                <Grid.Column width={16} style={{ marginTop: 5, paddingLeft: 0 }}>
                                                    {this.state.duration && (
                                                        <VideoTimeline
                                                            splitterDragging={this.state.splitterDragging}
                                                            currentTime={this.state.currentTime}
                                                            onTimeChange={this.onTimeChange}
                                                            duration={this.state.duration}
                                                            subtitles={this.props.subtitles}
                                                            onSubtitleChange={this.onSaveSubtitle}
                                                            onAddSubtitle={this.onAddSubtitle}
                                                            onSubtitleSelect={(subtitle, index) => this.props.setSelectedSubtitle(subtitle, index)}
                                                            onSubtitleSplit={this.onSubtitleSplit}
                                                        />
                                                    )}
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                                {this.props.article && this.props.article.speakersProfile && this.props.selectedSubtitle && this.props.selectedSubtitle.subtitle && (
                                    <Grid.Row>
                                        <Grid.Column width={16}>

                                            <div style={{ width: '100%', padding: '2rem' }}>
                                                <SubtitleForm
                                                    loading={this.props.updateSubslideState === 'loading'}
                                                    subtitle={this.props.selectedSubtitle.subtitle}
                                                    speakers={this.props.article.speakersProfile}
                                                    onSave={(changes) => {
                                                        const { text, speakerNumber } = changes;
                                                        const speakerProfile = this.props.article.speakersProfile.find((speaker) => speaker.speakerNumber === speakerNumber);
                                                        this.onSaveSubtitle(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex, { text, speakerProfile })
                                                    }}
                                                    onDelete={() => this.onSubslideDelete(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex)}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                )}

                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        {this.props.article && (
                                            <div style={{ width: '100%', padding: '2rem', color: 'white' }}>
                                                <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column width={4}>
                                                            <h3>Splitter:</h3>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            <span
                                                                draggable
                                                                onDragEnd={() => this.setState({ splitterDragging: false })}
                                                                onDragStart={e => {
                                                                    e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                                                    this.setState({ splitterDragging: true })
                                                                }}
                                                                style={{ width: 30, height: 30, cursor: 'pointer', display: 'inline-block' }}
                                                            >
                                                                <SplitterIcon />
                                                            </span>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                                <h3>Speakers: </h3>
                                                <Grid>
                                                    {this.props.article.speakersProfile.map((speaker, index) => (
                                                        <Grid.Row style={{ listStyle: 'none', padding: 10 }} key={'speakers' + index}>
                                                            <Grid.Column width={4}>
                                                                <span>Speaker {speaker.speakerNumber}</span>
                                                            </Grid.Column>
                                                            <Grid.Column width={4}>
                                                                <Dropdown
                                                                    value={speaker.speakerGender}
                                                                    options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                                                                    onChange={(e, { value }) => this.onSpeakerGenderChange(speaker, value)}
                                                                />
                                                            </Grid.Column>
                                                            <Grid.Column width={4}>
                                                                <div
                                                                    draggable={true}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        position: 'relative',
                                                                        color: 'white',
                                                                        cursor: 'pointer',
                                                                        height: 20,
                                                                        display: 'inline-block',
                                                                    }}
                                                                    onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker }))}
                                                                >
                                                                    <SpeakerDragItem speaker={speaker} />
                                                                </div>
                                                            </Grid.Column>

                                                            <Grid.Column width={2}>
                                                                {index === this.props.article.speakersProfile.length - 1 && (
                                                                    <Button color="red" onClick={() => this.onDeleteSpeaker(index)} icon="trash" size="tiny" />
                                                                )}
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    ))}
                                                    <Grid.Row>
                                                        <Grid.Column style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                            <Button color="blue" onClick={this.onAddSpeaker} >Add Speaker</Button>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </div>
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }

    renderDone = () => {
        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: successLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div key={'lottie-success'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Lottie options={defaultOptions}
                    height={400}
                    width={400}
                />
            </div>
        )
    }

    renderLoader = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <Lottie options={defaultOptions} height={400} width={400} />
        )
    }

    render() {
        let comp = null;
        switch (this.getVideoStatus()) {
            case 'uploaded':
            case 'transcriping':
            case 'cutting':
            case 'converting':
                comp = this.renderLoader(); break;
            case 'proofreading':
                comp = this.renderProofreading(); break;
            case 'done':
                comp = this.renderDone(); break;
            default:
                break;
        }

        return (
            <Grid style={{ height: '100%', width: '100%', margin: 0 }}>
                <Grid.Row style={{ marginBottom: 0, padding: 0 }}>
                    <Grid.Column width={3} style={{ padding: 0 }}>
                        <Grid style={{ width: '100%', height: '100%', backgroundColor: '#424650', color: 'white', borderRadius: 0, borderRight: '1px solid black', margin: 0, position: 'relative', zIndex: 2 }}>
                            {this.renderInstructions()}
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={13} style={{ padding: 0, backgroundColor: '#30343f' }}>
                        <Grid>
                            <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
                                <Grid.Column width={16} style={{ padding: 0 }}>
                                    {this.renderProgress()}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                {comp}
                                {/* {this.renderProofreading()} */}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = ({ video, article }) => ({
    video: video.video,
    fetchVideoState: video.fetchVideoState,
    article: article.article,
    fetchArticleState: article.fetchArticleState,
    updateSubslideState: article.updateSubslideState,
    subtitles: article.subtitles,
    selectedSubtitle: article.selectedSubtitle,
    stages: video.convertStages.stages,
    activeStageIndex: video.convertStages.activeStageIndex,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideoById: (id) => dispatch(videoActions.fetchVideoById(id)),
    fetchArticleByVideoId: id => dispatch(articleActions.fetchArticleByVideoId(id)),
    updateSubslide: (slideIndex, subslideIndex, changes) => dispatch(articleActions.updateSubslide(slideIndex, subslideIndex, changes)),
    onSplitSubslide: (slideIndex, subslideIndex, wordIndex) => dispatch(articleActions.splitSubslide(slideIndex, subslideIndex, wordIndex)),
    addSubslide: subslide => dispatch(articleActions.addSubslide(subslide)),
    onDeleteSubslide: (slideIndex, subslideIndex) => dispatch(articleActions.deleteSubslide(slideIndex, subslideIndex)),
    setSlidesToSubtitles: slides => dispatch(articleActions.setSlidesToSubtitles(slides)),
    setSubtitles: subtitles => dispatch(articleActions.setSubtitles(subtitles)),
    setSelectedSubtitle: (subtitle, index) => dispatch(articleActions.setSelectedSubtitle(subtitle, index)),
    onSpeakersChange: speakers => dispatch(articleActions.updateSpeakers(speakers)),
    convertVideoToArticle: videoId => dispatch(videoActions.convertVideoToArticle(videoId)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Convert)
);