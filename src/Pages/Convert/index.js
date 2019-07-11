import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Progress, Grid, Card, Dropdown, Button } from 'semantic-ui-react';

import * as articleActions from '../../actions/article';
import * as videoActions from '../../actions/video';
import ProgressBoxes from '../../shared/components/ProgressBoxes';
import Proofreading from '../../shared/components/Proofreading';
import VideoTimeline from '../../shared/components/VideoTimeline';
import SubtitleForm from './SubtitleForm';
import { SPEAKER_BACKGROUND_COLORS } from '../../shared/constants';

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
        currentTime: 0,
        duration: 0,
        subtitles: [],
        selectedSubtitle: null,
        selectedSubtitleIndex: null,
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
        if (this.props.fetchArticleState === 'loading' && nextProps.fetchArticleState === 'done') {
            const { slides } = nextProps.article;
            this.props.setSlidesToSubtitles(slides);
        }
    }

    startPoller = () => {
        const { videoId } = this.props.match.params;
        // const videoId = '5d1d9b007e2a29705e0f2f11'
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
        return parseInt(this.state.stages.filter(stage => stage.completed).length / this.state.stages.length * 100);
    }

    renderProgress = () => {
        return (
            <div>
                {this.getVideoStatus() !== 'failed' && this.state.stages ? (
                    <React.Fragment>
                        <ProgressBoxes stages={this.state.stages} />
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

    render() {
        return (
            <div>
                {this.renderProgress()}
                {this.getVideoStatus() === 'proofreading' && (
                    <div>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Grid style={{ display: 'flex', justifyContent: 'center', marginBottom: '.2rem' }}>
                                        <Grid.Row>
                                            <Grid.Column width={8}>
                                                <Card style={{ width: '100%', height: '100%', padding: '2rem' }}>
                                                    <h2>Instructions:</h2>
                                                </Card>
                                            </Grid.Column>
                                            <Grid.Column width={8}>

                                                <Card style={{ width: '100%', height: '100%' }}>
                                                    <video src={'/1.mp4'} controls ref={(ref) => this.vidoeRef = ref} onLoadedData={this.onVideoLoad} width={'100%'} />
                                                    {/* <video src={this.props.video.url} controls ref={(ref) => this.vidoeRef = ref} onLoadedData={this.onVideoLoad} /> */}
                                                </Card>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    {this.state.duration && (
                                        <VideoTimeline
                                            currentTime={this.state.currentTime}
                                            onTimeChange={this.onTimeChange}
                                            duration={this.state.duration}
                                            subtitles={this.props.subtitles}
                                            onSubtitleChange={this.onSaveSubtitle}
                                            onAddSubtitle={this.onAddSubtitle}
                                            onSubtitleSelect={(subtitle, index) => this.props.setSelectedSubtitle(subtitle, index)}
                                        />
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}>

                                    {this.props.article && this.props.article.speakersProfile && this.props.selectedSubtitle && this.props.selectedSubtitle.subtitle && (
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
                                    )}
                                </Grid.Column>

                                <Grid.Column width={2}>
                                </Grid.Column>

                                <Grid.Column width={6}>
                                    {this.props.article && (
                                        <Card style={{ width: '100%', padding: '2rem' }}>
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
                                                        {/* <Grid.Column width={4}>
                                                            <div style={{ height: 31, width: '100%', backgroundColor: SPEAKER_BACKGROUND_COLORS[speaker.speakerNumber] }} />
                                                        </Grid.Column> */}
                                                        <Grid.Column width={4}>
                                                            <div
                                                                draggable={true}
                                                                style={{
                                                                    // fontWeight: 'bold',
                                                                    // fontSize: '2rem',
                                                                    backgroundColor: 'transparent',
                                                                    position: 'relative',
                                                                    color: 'white',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker }))}
                                                            >
                                                                <div
                                                                    style={{
                                                                        // display: 'inline-block',
                                                                        // top: 20,
                                                                        height: 20,
                                                                        background: SPEAKER_BACKGROUND_COLORS[speaker.speakerNumber] || 'white',
                                                                        paddingLeft: 15,
                                                                        width: 80,
                                                                    }}
                                                                >
                                                                </div>
                                                                <div
                                                                    // key={slide.text + 'left-handler'}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        height: 20,
                                                                        width: 10,
                                                                        left: 0,
                                                                        zIndex: 5,
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{ background: '#A2A3A4', position: 'absolute', height: '100%', width: 10 }}
                                                                    >
                                                                        {'<'}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    // key={slide.text + 'right-handler'}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        height: 20,
                                                                        width: 10,
                                                                        left: 80,
                                                                        zIndex: 5,
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{ background: '#A2A3A4', position: 'absolute', cursor: 'col-resize', height: '100%', width: 10 }}
                                                                    >
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
                                                    <Grid.Column style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button color="blue" onClick={this.onAddSpeaker} >Add Speaker</Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Card>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {/* <Proofreading video={this.props.video} article={this.props.article} /> */}
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
    updateSubslideState: article.updateSubslideState,
    subtitles: article.subtitles,
    selectedSubtitle: article.selectedSubtitle,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideoById: (id) => dispatch(videoActions.fetchVideoById(id)),
    fetchArticleByVideoId: id => dispatch(articleActions.fetchArticleByVideoId(id)),
    updateSubslide: (slideIndex, subslideIndex, changes) => dispatch(articleActions.updateSubslide(slideIndex, subslideIndex, changes)),
    addSubslide: subslide => dispatch(articleActions.addSubslide(subslide)),
    onDeleteSubslide: (slideIndex, subslideIndex) => dispatch(articleActions.deleteSubslide(slideIndex, subslideIndex)),
    setSlidesToSubtitles: slides => dispatch(articleActions.setSlidesToSubtitles(slides)),
    setSubtitles: subtitles => dispatch(articleActions.setSubtitles(subtitles)),
    setSelectedSubtitle: (subtitle, index) => dispatch(articleActions.setSelectedSubtitle(subtitle, index)),
    onSpeakersChange: speakers => dispatch(articleActions.updateSpeakers(speakers))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Convert)
);