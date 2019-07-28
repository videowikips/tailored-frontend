import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import Lottie from 'react-lottie';
import { Grid, Card, Button, Icon, Input, Progress } from 'semantic-ui-react';

import SlidesList from '../../../shared/components/SlidesList';
import AudioRecorder from '../../../shared/components/AudioRecorder';
import TranslateBox from './TranslateBox';
import Editor from '../../../shared/components/Editor';

import *  as translationActions from '../../../actions/translation';
import * as pollerActions from '../../../actions/poller';
import aroundTheWorldLottie from '../../../shared/lottie/around-the-world.json';

const FETCH_ARTICLE_JOBNAME = 'FETCH_TRANSLATE_ARTICLE';
class TranslateArticle extends React.Component {
    state = {
        pollerStarted: false,
    }
    componentWillMount() {
        const { articleId } = this.props.match.params;
        const { lang } = querystring.parse(window.location.search);
        this.props.fetchTranslatableArticle(articleId, lang);
    }

    componentWillReceiveProps(nextProps) {
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

    onSlideChange = (currentSlideIndex, currentSubslideIndex) => {
        this.props.setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex });
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
        this.props.setRecording(false);
        const { slide, subslide } = this.getCurrentSlideAndSubslide();
        this.props.saveRecordedTranslation(slide.position, subslide.position, recordedBlob);
    }


    toggleRecording = () => {
        this.props.setRecording(!this.props.recording);
    }

    _renderUploadAudio() {
        return (
            <Input
                input={(
                    <input
                        type="file"
                        onChange={this.onUploadAudioChange}
                        value={this.props.uploadAudioInputValue}
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
            originalArticle,
            translatableArticle,
            currentSlideIndex,
            currentSubslideIndex,
            recording,
            editorMuted,
            editorPlaying,
            recordUploadLoading
        } = this.props;

        return (
            <Grid style={{ width: '100%' }}>
                {(!originalArticle || (!translatableArticle || translatableArticle.translationProgress !== 100)) && (
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.renderLoadingLottie()}
                        </Grid.Column>
                    </Grid.Row>
                )}
                {originalArticle && translatableArticle && translatableArticle.translationProgress === 100 && (
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
                                            {originalArticle && (
                                                <Editor
                                                    showSidebar
                                                    showDescription
                                                    article={originalArticle}
                                                    controlled
                                                    muted={editorMuted}
                                                    isPlaying={editorPlaying}
                                                    onPlay={() => this.props.setEditorPlaying(true)}
                                                    onPause={() => this.props.setEditorPlaying(false)}
                                                    currentSlideIndex={currentSlideIndex}
                                                    currentSubslideIndex={currentSubslideIndex}
                                                    onSlideChange={this.onSlideChange}
                                                    layout={1}
                                                />
                                            )}
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column computer={16} mobile={16}>
                                            <Card style={{ margin: 0, width: '100%' }}>
                                                <Card.Content>
                                                    <div className="c-export-human-voice__recorder-container">
                                                        <Button
                                                            icon
                                                            primary
                                                            size="large"
                                                            // ="left"
                                                            loading={recordUploadLoading}
                                                            disabled={recordUploadLoading}
                                                            onClick={this.toggleRecording}
                                                        >
                                                            {!recording ? (
                                                                <Icon name="microphone" />
                                                            ) : (
                                                                    <Icon name="stop" />
                                                                )}
                                                            {!recording ? ' Record' : ' Stop'}
                                                        </Button>
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
                                                        <div className="c-export-human-voice__recorder-mic-container" style={{ 'visibility': recording ? 'visible' : 'hidden' }} >
                                                            <AudioRecorder
                                                                record={recording}
                                                                loading={this.props.recordUploadLoading}
                                                                className="c-export-human-voice__recorder-mic"
                                                                onStop={this.onRecordingStop}
                                                                backgroundColor="#2185d0"
                                                                strokeColor="#000000"
                                                            />
                                                        </div>
                                                    </div>
                                                    <TranslateBox
                                                        value={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].text || ''}
                                                        onSave={this.onSaveTranslatedText}
                                                        currentSlideIndex={currentSlideIndex}
                                                        currentSubslideIndex={currentSubslideIndex}
                                                    />
                                                    {/* {this._renderSlideTranslateBox()} */}
                                                </Card.Content>
                                            </Card>
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <SlidesList
                                    currentSlideIndex={currentSlideIndex}
                                    currentSubslideIndex={currentSubslideIndex}
                                    slides={translatableArticle.slides}
                                    onSubslideClick={this.onSlideChange}
                                />
                            </Grid.Column>
                        </Grid.Row>


                    </React.Fragment>

                )}


            </Grid>
        )
    }
}

const mapStateToProps = ({ translation }) => ({
    recording: translation.recording,
    originalArticle: translation.originalArticle,
    translatableArticle: translation.translatableArticle,
    currentSlideIndex: translation.currentSlideIndex,
    currentSubslideIndex: translation.currentSubslideIndex,
    recordUploadLoading: translation.recordUploadLoading,
    editorPlaying: translation.editorPlaying,
    editorMuted: translation.editorMuted,
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
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticle);