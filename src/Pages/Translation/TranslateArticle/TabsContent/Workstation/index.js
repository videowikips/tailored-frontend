import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import Lottie from 'react-lottie';
import { Grid, Card, Button, Icon, Input, Progress, Select } from 'semantic-ui-react';
import Switch from 'react-switch';
import { withRouter } from 'react-router-dom';

import SlidesList from '../../../../../shared/components/SlidesList';
import AudioRecorder from '../../../../../shared/components/AudioRecorder';
import TranslateBox from './TranslateBox';
import Editor from '../../../../../shared/components/Editor';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';

import *  as translationActions from '../../modules/actions';
import * as pollerActions from '../../../../../actions/poller';
import aroundTheWorldLottie from '../../../../../shared/lottie/around-the-world.json';
import websockets from '../../../../../websockets';

import './style.scss'
const FETCH_ARTICLE_JOBNAME = 'FETCH_TRANSLATE_ARTICLE';

const calculateCompletedArticlePercentage = article => {
    const slides = article.slides.reduce((acc, slide) => acc.concat(slide.content), []).filter((slide) => slide);
    const completedCount = slides.reduce((acc, slide) => slide.text && slide.audio ? ++acc : acc, 0);
    return Math.floor(completedCount / slides.length * 100)
}
class Workstation extends React.Component {
    state = {
        pollerStarted: false,
    }
    componentWillMount() {
        const { articleId } = this.props.match.params;
        console.log(articleId)
        const { lang } = querystring.parse(window.location.search);
        this.props.fetchTranslatableArticle(articleId, lang);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.translatableArticle && nextProps.translatableArticle && !this.socketSub) {
            this.initSocketSub(nextProps.translatableArticle)
        }
        if (nextProps.translatableArticle) {
            if (nextProps.translatableArticle.translationProgress !== 100 && !this.state.pollerStarted) {
                this.props.startJob({ jobName: FETCH_ARTICLE_JOBNAME, interval: 3000 }, () => {
                    const { articleId } = this.props.match.params;
                    const { lang } = querystring.parse(window.location.search);
                    this.props.fetchTranslatableArticle(articleId, lang);
                })
                this.setState({ pollerStarted: true })
            } else if (nextProps.translatableArticle.translationProgress === 100 && this.state.pollerStarted) {
                this.props.stopJob(FETCH_ARTICLE_JOBNAME);
                this.setState({ pollerStarted: false });
            }
        }
    }

    componentWillUnmount = () => {
        if (this.socketSub && this.props.translatableArticle && this.props.translatableArticle._id) {
            websockets.unsubscribeFromEvent(`${websockets.websocketsEvents.RECORDED_AUDIO_PROCESSED}/${this.props.translatableArticle._id}`)
        }
    }

    initSocketSub = (translatableArticle) => {
        websockets.subscribeToEvent(`${websockets.websocketsEvents.RECORDED_AUDIO_PROCESSED}/${translatableArticle._id}`, (data) => {
            console.log('got socket data', data);
            const { slidePosition, subslidePosition, audio } = data;
            this.props.updateSlideAudio(slidePosition, subslidePosition, audio);
        })
    }

    canPreview = () => {
        const { translatableArticle } = this.props;
        if (!translatableArticle) return false;
        if (this.props.preview) {
            return true;
        }
        return translatableArticle.slides.reduce((acc, s) => acc.concat(s.content), []).every((s) => s.audio && s.text);
    }

    canExport = () => {
        const { originalTranslatableArticle } = this.props;
        if (!originalTranslatableArticle) return false;
        return originalTranslatableArticle.slides.reduce((acc, s) => acc.concat(s.content), []).every((s) => s.audio && s.text);
    }

    onSlideChange = (currentSlideIndex, currentSubslideIndex) => {
        this.props.setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex });
        if (!this.props.preview) {
            this.props.setEditorPlaying(false);
        }
    }

    onPlayComplete = () => {
        if (this.props.preview) {
            // this.props.setEditorPlaying(false);
        }
    }

    getCurrentSlideAndSubslide = () => {

        const { translatableArticle, currentSlideIndex, currentSubslideIndex } = this.props;
        const slide = translatableArticle.slides[currentSlideIndex];
        const subslide = slide.content[currentSubslideIndex];
        return { slide, subslide };
    }

    onSaveTranslatedText = (value, slideIndex, subslideIndex) => {
        const slide = this.props.translatableArticle.slides[slideIndex];
        const subslide = this.props.translatableArticle.slides[slideIndex].content[subslideIndex];
        this.props.saveTranslatedText(slide.position, subslide.position, value);
    }



    onRecordingStop = (recordedBlob) => {
        this.toggleRecording();
        if (recordedBlob) {
            const { slide, subslide } = this.getCurrentSlideAndSubslide();
            this.props.saveRecordedTranslation(slide.position, subslide.position, recordedBlob);
        }
    }


    toggleRecording = () => {
        if (!this.props.recording) {
            this.props.setEditorMuted(true);
            this.props.setEditorPlaying(true);
        } else {
            this.props.setEditorMuted(false);
            this.props.setEditorPlaying(false);
        }
        this.props.setRecording(!this.props.recording);
    }

    onPreviewChange = (preview) => {
        console.log('on preview change', preview)
        this.props.onPreviewChange(preview);
    }

    onUploadAudioChange = e => {

        this.props.setRecording(false);
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.saveRecordedTranslation(slide.position, subslide.position, e.target.files[0]);;
        e.target.value = ''
    }

    onExport = () => {
        this.props.exportTranslation()
    }

    _renderUploadAudio() {
        return (
            <Input
                input={(
                    <input
                        type="file"
                        onChange={this.onUploadAudioChange}
                        // value={this.props.uploadAudioInputValue}
                        accept=".webm, .mp3, .wav"
                    />
                )}
            />
        );
    }

    renderLoadingLottie = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: aroundTheWorldLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div key="translate-progress-loader" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <div style={{ width: '50%' }}>
                    <Lottie options={defaultOptions}
                        height={400}
                        width={400}
                    />
                    <Progress indicating progress percent={this.props.translatableArticle ? this.props.translatableArticle.translationProgress : 0} />
                    <p style={{ textAlign: 'center', fontSize: '2rem', padding: '1rem' }}>Translating the video's text...</p>
                </div>
            </div>
        )
    }

    render() {
        const {
            originalViewedArticle,
            translatableArticle,
            currentSlideIndex,
            currentSubslideIndex,
            recording,
            editorMuted,
            editorPlaying,
            recordUploadLoading
        } = this.props;

        return (
            <LoaderComponent active={!this.props.originalViewedArticle || !this.props.translatableArticle}>
                <Grid style={{ width: '100%' }}>
                    {(!originalViewedArticle || (!translatableArticle || translatableArticle.translationProgress !== 100)) && (
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {this.renderLoadingLottie()}
                            </Grid.Column>
                        </Grid.Row>
                    )}
                    {originalViewedArticle && translatableArticle && translatableArticle.translationProgress === 100 && (
                        <React.Fragment>
                            <Grid.Row>
                                {/* <Grid.Column width={4}>
                                <SlidesList
                                    currentSlideIndex={currentSlideIndex}
                                    currentSubslideIndex={currentSubslideIndex}
                                    slides={translatableArticle.slides}
                                    onSubslideClick={this.onSlideChange}
                                />
                            </Grid.Column> */}
                                <Grid.Column width={12}>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Editor
                                                    showSidebar
                                                    showDescription
                                                    article={originalViewedArticle}
                                                    controlled
                                                    muted={editorMuted}
                                                    isPlaying={editorPlaying}
                                                    onPlay={() => this.props.setEditorPlaying(true)}
                                                    onPause={() => this.props.setEditorPlaying(false)}
                                                    currentSlideIndex={currentSlideIndex}
                                                    currentSubslideIndex={currentSubslideIndex}
                                                    onSlideChange={this.onSlideChange}
                                                    onPlayComplete={this.onPlayComplete}
                                                    layout={1}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Select
                                                    disabled={this.props.preview}
                                                    value={this.props.selectedSpeakerNumber}
                                                    options={[{ text: 'All', value: -1 }].concat(originalViewedArticle.speakersProfile.map((sp) => ({ text: `Speaker ${sp.speakerNumber} (${sp.speakerGender})`, value: sp.speakerNumber })))}
                                                    onChange={(e, { value }) => this.props.changeSelectedSpeakerNumber(value)}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Progress progress indicating percent={calculateCompletedArticlePercentage(translatableArticle)} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        {!this.props.preview ? (
                                            <Grid.Row>
                                                <Grid.Column computer={16} mobile={16}>
                                                    <Card style={{ margin: 0, width: '100%' }}>
                                                        <Card.Content>
                                                            <div className="c-export-human-voice__recorder-container">
                                                                <div className="c-export-human-voice__recorder-mic-container">
                                                                    <AudioRecorder
                                                                        record={recording}
                                                                        loading={recordUploadLoading}
                                                                        disabled={recordUploadLoading}
                                                                        onStart={this.toggleRecording}
                                                                        maxDuration={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].media[0].duration}
                                                                        className="c-export-human-voice__recorder-mic"
                                                                        onStop={this.onRecordingStop}
                                                                        backgroundColor="#2185d0"
                                                                        strokeColor="#000000"
                                                                    />
                                                                </div>
                                                                {!recording && (
                                                                    <div style={{ margin: 5 }}>
                                                                        Or
                                                                    </div>
                                                                )}
                                                                {!recording && this._renderUploadAudio()}
                                                                {translatableArticle.slides[currentSlideIndex] && translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].audio && !recording && (
                                                                    <div className="c-export-human-voice__audio_container" >
                                                                        <audio
                                                                            key={`audio-player-${translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].audio}`}
                                                                            controls
                                                                            onPlay={() => {
                                                                                this.props.setEditorPlaying(true)
                                                                                this.props.setEditorMuted(true);
                                                                            }}
                                                                            onPause={() => {
                                                                                this.props.setEditorPlaying(false)
                                                                                this.props.setEditorMuted(false);
                                                                            }}
                                                                            onEnded={() => {
                                                                                this.props.setEditorPlaying(false)
                                                                                this.props.setEditorMuted(false);
                                                                            }}
                                                                        >
                                                                            <source src={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].audio} />
                                                                            Your browser does not support the audio element.
                                                                </audio>
                                                                        <Icon
                                                                            name="close"
                                                                            className="c-export-human-voice__clear-record"
                                                                            onClick={() => {
                                                                                const { slide, subslide } = this.getCurrentSlideAndSubslide();
                                                                                this.props.deleteRecordedTranslation(slide.position, subslide.position);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}

                                                            </div>
                                                            <small>Maximum audio duration: {parseInt(translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].media[0].duration)} seconds</small>
                                                            {translatableArticle.slides[currentSlideIndex] && (

                                                                <TranslateBox
                                                                    value={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].text || ''}
                                                                    onSave={this.onSaveTranslatedText}
                                                                    currentSlideIndex={currentSlideIndex}
                                                                    currentSubslideIndex={currentSubslideIndex}
                                                                />
                                                            )}
                                                            {/* {this._renderSlideTranslateBox()} */}
                                                        </Card.Content>
                                                    </Card>
                                                </Grid.Column>
                                                <Grid.Column width={4}>
                                                </Grid.Column>
                                            </Grid.Row>
                                        ) : null}

                                    </Grid>
                                </Grid.Column>

                                <Grid.Column width={4}>

                                    <Grid style={{ maxHeight: '850px', overflowY: 'scroll', border: '3px solid #eee', margin: 0, paddingTop: 5 }} >
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Grid className="preview-container">
                                                    <Grid.Row>
                                                        <Grid.Column width={16}>
                                                            <h3 className="preview-header">All Slides</h3>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Grid.Column width={12}>
                                                            <h3>Preview</h3>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
                                                            {/* <Rail /> */}
                                                            <Switch
                                                                disabled={!this.canPreview()}
                                                                checked={this.props.preview}
                                                                onChange={this.onPreviewChange}
                                                                onColor="#86d3ff"
                                                                onHandleColor="#2693e6"
                                                                handleDiameter={30}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                                                height={20}
                                                                width={48}
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Grid.Column width={16}>
                                                            <Button
                                                                fluid
                                                                color="green"
                                                                disabled={!this.canExport()}
                                                                onClick={this.onExport}
                                                            >
                                                                Export
                                                            </Button>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <SlidesList
                                            currentSlideIndex={currentSlideIndex}
                                            currentSubslideIndex={currentSubslideIndex}
                                            slides={translatableArticle.slides}
                                            onSubslideClick={this.onSlideChange}
                                        />
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        </React.Fragment>
                    )}
                </Grid>
            </LoaderComponent>

        )
    }
}

const mapStateToProps = ({ translateArticle }) => ({
    ...translateArticle
})
const mapDispatchToProps = dispatch => ({
    fetchTranslatableArticle: (originalArticleId, lang) => dispatch(translationActions.fetchTranslatableArticle(originalArticleId, lang)),
    setCurrentSlideIndex: index => dispatch(translationActions.setCurrentSlideIndex(index)),
    setCurrentSubslideIndex: index => dispatch(translationActions.setCurrentSubslideIndex(index)),
    setCurrentEditorIndexes: indexes => dispatch(translationActions.setCurrentEditorIndexes(indexes)),
    saveTranslatedText: (slidePositon, subslidePosition, text) => dispatch(translationActions.saveTranslatedText(slidePositon, subslidePosition, text)),
    setRecording: recording => dispatch(translationActions.setRecording(recording)),
    saveRecordedTranslation: (slidePositon, subslidePosition, blob) => dispatch(translationActions.saveRecordedTranslation(slidePositon, subslidePosition, blob)),
    deleteRecordedTranslation: (slidePositon, subslidePosition) => dispatch(translationActions.deleteRecordedTranslation(slidePositon, subslidePosition)),
    setEditorPlaying: playing => dispatch(translationActions.setEditorPlaying(playing)),
    setEditorMuted: muted => dispatch(translationActions.setEditorMuted(muted)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),
    onPreviewChange: preview => dispatch(translationActions.onPreviewChange(preview)),
    changeSelectedSpeakerNumber: num => dispatch(translationActions.changeSelectedSpeakerNumber(num)),
    updateSlideAudio: (slidePositon, subslidePosition, audio) => dispatch(translationActions.updateSlideAudio(slidePositon, subslidePosition, audio)),
    exportTranslation: (articleId) => dispatch(translationActions.exportTranslation(articleId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Workstation));