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
            <div className="proofreading">
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
                                                    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }}>
                                                        {this.props.video && (
                                                            <video
                                                                controlsList=""
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" width="30px"><g><g>
                                                                    <g>
                                                                        <path d="M451.241,23.448C436.12,8.328,416.014,0,394.63,0c-21.385,0-41.49,8.328-56.61,23.448L103.857,257.612l4.163,18.048    L0.229,383.451L53.701,512L199.03,366.67l18.049,4.162L451.241,136.67C482.456,105.454,482.456,54.664,451.241,23.448z     M64.327,458.369l-28.205-67.807l79.959-79.958l8.413,36.473l0.586,2.539l39.004,8.995L64.327,458.369z M207.492,337.415    l-17.594-4.058l-39.461-9.099l-0.566-2.452l-12.595-54.608l197.16-197.161l24.357,24.357L190.646,262.541l21.502,21.502    l168.148-168.147l24.357,24.358L207.492,337.415z M429.739,115.167l-3.584,3.584l-70.216-70.217l3.583-3.583    c9.378-9.378,21.846-14.543,35.108-14.543c13.262,0,25.731,5.164,35.109,14.542C449.097,64.31,449.097,95.808,429.739,115.167z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                    </g>
                                                                </g><g>
                                                                        <g>
                                                                            <rect x="467.69" y="481.453" width="44.081" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g><g>
                                                                        <g>
                                                                            <rect x="397.446" y="481.453" width="44.082" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g><g>
                                                                        <g>
                                                                            <rect x="327.201" y="481.453" width="44.082" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g><g>
                                                                        <g>
                                                                            <rect x="256.957" y="481.453" width="44.081" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g><g>
                                                                        <g>
                                                                            <rect x="186.712" y="481.453" width="44.081" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g><g>
                                                                        <g>
                                                                            <rect x="116.468" y="481.453" width="44.081" height="30.409" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF" />
                                                                        </g>
                                                                    </g></g>
                                                                </svg>
                                                            </span>
                                                            {/* <Icon
                                                                style={{ padding: 5, cursor: 'pointer', display: 'inline-block' }}
                                                                draggable
                                                                onDragEnd={() => this.setState({ splitterDragging: false })}
                                                                onDragStart={e => {
                                                                    e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                                                    this.setState({ splitterDragging: true })
                                                                    console.log('drag start')
                                                                }}
                                                                name={'cut'} /> */}
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
        console.log(this.getVideoStatus())
        return (
            <div style={{ width: '100%', height: '100%'}}>
                {/* {this.getVideoStatus() !== 'proofreading' && this.renderProgress()} */}
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4} style={{ padding: 0 }}>
                            <Grid style={{ width: '100%', height: '100%', backgroundColor: '#424650', color: 'white', borderRadius: 0, borderRight: '1px solid black' }}>
                                {this.renderInstructions()}
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={12} style={{ padding: 0, backgroundColor: '#30343f' }}>
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