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

class Convert extends React.Component {

    state = {
        stages: [],
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
        if (this.vidoeRef) {
            this.vidoeRef.ontimeupdate = null
        }
    }

    onTimeChange = (currentTime) => {
        this.vidoeRef.currentTime = currentTime / 1000;
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
        if (this.vidoeRef) {
            this.vidoeRef.ontimeupdate = () => {
                console.log('on playing')
                this.setState({ currentTime: this.vidoeRef.currentTime * 1000 });
            }
            console.log('on load', this.vidoeRef.duration, this.vidoeRef.currentTime);
            this.setState({ duration: this.vidoeRef.duration * 1000 })
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
        console.log('done')
        this.stopPoller();
        setTimeout(() => {
            console.log('Navigating to article')
            if (this.props.article) {
                this.props.history.push(`/article/${this.props.article._id}`)
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

    getVideoStatus = () => {
        if (this.props.video && this.props.video.status) return this.props.video.status;
        return null;
    }

    getProgress = () => {
        return parseInt(this.props.stages.filter(stage => stage.completed).length / this.props.stages.length * 100);
    }

    renderProgress = () => {
        return (
            <div>
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

    renderProofreading = () => {
        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Card style={{ width: '100%', height: '100%', padding: '2rem' }}>
                                <h2>Instructions:</h2>

                                {this.renderConvertConfirmModal()}
                                <Button color="green" onClick={() => this.setState({ isConfirmConvertModalVisible: true })} >
                                    Save and Convert <Icon name={"arrow right"} />
                                </Button>
                            </Card>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Grid style={{ display: 'flex', justifyContent: 'center', marginBottom: '.2rem' }}>
                                            <Grid.Row>
                                                <Grid.Column width={16}>
                                                    <Card style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                        {this.props.video && (
                                                            <video
                                                                controls
                                                                width={'100%'}
                                                                style={{ width: 700, maxWidth: '100%', margin: '0 auto' }}
                                                                src={'/1.mp4' || this.props.video.url}
                                                                ref={(ref) => this.vidoeRef = ref}
                                                                onLoadedData={this.onVideoLoad}
                                                            />
                                                        )}
                                                        <span
                                                            style={{ position: 'absolute', left: '45%', bottom: '10%', color: 'white' }}
                                                        >
                                                            Time: {formatTime(this.state.currentTime)}/{formatTime(this.state.duration)}
                                                        </span>
                                                    </Card>
                                                </Grid.Column>

                                                <Grid.Column width={16} style={{ marginTop: 5 }}>
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

                                            <Card style={{ width: '100%', padding: '2rem' }}>
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
                                            </Card>
                                        </Grid.Column>
                                    </Grid.Row>
                                )}

                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        {this.props.article && (
                                            <Card style={{ width: '100%', padding: '2rem' }}>
                                                <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column width={4}>
                                                            <h3>Splitter:</h3>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            {/* <span

                                                    draggable
                                                    onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({ split: true }))}
                                                    style={{ width: 30, cursor: 'pointer', display: 'inline-block' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 80 100"><g><path d="M47.13,22.24l-7.07,7.07c-0.18,0.19-0.29,0.44-0.29,0.71c0,0.27,0.11,0.52,0.29,0.71l4.24,4.24   c0.2,0.19,0.45,0.29,0.71,0.29s0.51-0.1,0.71-0.29l7.07-7.07c0.18-0.19,0.29-0.44,0.29-0.71c0-0.27-0.11-0.52-0.29-0.71l-4.24-4.24   C48.16,21.85,47.52,21.85,47.13,22.24z" /><path d="M66.47,21.87l-12.23-8.12c-1.98-1.31-4.65-1.04-6.35,0.66l-0.69,0.7l-0.07,0.07L23.09,39.21   c-0.26,0.27-0.36,0.67-0.2401,1.03l0.86,2.59l0.0015,0.0045L12.4834,54.0625c-0.248,0.248-0.3486,0.6084-0.2627,0.9492   l2.8291,11.3105c0.0869,0.3496,0.3555,0.625,0.7031,0.7217c0.0879,0.0244,0.1777,0.0361,0.2666,0.0361   c0.2617,0,0.5166-0.1025,0.707-0.293l15.4687-15.4687L32.2,51.32l2.59,0.86c0.11,0.03,0.21,0.05,0.32,0.05   c0.26,0,0.52-0.1,0.71-0.29l17.51-17.51c0.45-0.46,1.08-0.67,1.71-0.58L57.53,34.2c0.95,0.12,1.8799-0.19,2.55-0.86l2.61-2.61   l4.23-4.23c0.65-0.65,0.96-1.54,0.87-2.45C67.7,23.16,67.22,22.36,66.47,21.87z M16.5615,64.124l-2.2637-9.0479L24.421,44.953   l1.259,3.767c0.1,0.3,0.33,0.53,0.63,0.63l3.7667,1.2589L16.5615,64.124z M58.66,31.92c-0.23,0.23-0.54,0.34-0.86,0.3l-2.48-0.35   c-1.27-0.17-2.51,0.24-3.41,1.14L34.84,50.09l-2.56-0.86l-4.86-1.62l-1.62-4.86l-0.86-2.56l22.9-22.89l12.72,12.72L58.66,31.92z" /></g></svg>
                                                </span> */}
                                                            {/* <Button
                                                    draggable
                                                    onDragStart={e => e.dataTransfer.setData('text', JSON.stringify({ split: true }))}
                                                    
                                                    icon="cut" /> */}
                                                            <Icon
                                                                style={{ padding: 5, cursor: 'pointer', display: 'inline-block' }}
                                                                draggable
                                                                onDragEnd={() => this.setState({ splitterDragging: false })}
                                                                onDragStart={e => {
                                                                    e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                                                    this.setState({ splitterDragging: true })
                                                                    console.log('drag start')
                                                                }}
                                                                name={'cut'} />
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
                                                                    <div
                                                                        style={{
                                                                            height: 20,
                                                                            background: SPEAKER_BACKGROUND_COLORS[speaker.speakerNumber] || 'white',
                                                                            paddingLeft: 15,
                                                                            width: 80,
                                                                        }}
                                                                    >
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            height: 20,
                                                                            width: 10,
                                                                            left: 0,
                                                                            zIndex: 5,
                                                                        }}
                                                                    >
                                                                        <span style={{ background: '#A2A3A4', position: 'absolute', height: '100%', width: 10 }} >
                                                                            {'<'}
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            height: 20,
                                                                            width: 10,
                                                                            left: 80,
                                                                            zIndex: 5,
                                                                        }}
                                                                    >
                                                                        <span style={{ background: '#A2A3A4', position: 'absolute', height: '100%', width: 10 }} >
                                                                            {'>'}
                                                                        </span>
                                                                    </div>
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
                                            </Card>
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
            <div key={'lottie-success'}>
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
            <div>
                {this.renderProgress()}
                {comp}
            </div>
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