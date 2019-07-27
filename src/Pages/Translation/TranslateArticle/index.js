import React from 'react';
import { connect } from 'react-redux';
import querystring from 'query-string';
import *  as translationActions from '../../../actions/translation'
import Editor from '../../../shared/components/Editor';

import { Grid, Card, Button, Icon, Input } from 'semantic-ui-react';
import SlidesList from '../../../shared/components/SlidesList';
import AudioRecorder from '../../../shared/components/AudioRecorder';
import TranslateBox from './TranslateBox';

class TranslateArticle extends React.Component {
    componentWillMount() {
        const { articleId } = this.props.match.params;
        const { lang } = querystring.parse(window.location.search);
        this.props.fetchTranslatableArticle(articleId, lang);
    }

    onSlideChange = (currentSlideIndex, currentSubslideIndex) => {
        this.props.setCurrentEditorIndexes({ currentSlideIndex, currentSubslideIndex });
    }

    getCurrentSlideAndSubslide = () => {

        const { translatableArticle, currentSlideIndex, currentSubslideIndex } = this.props;
        const slide = translatableArticle.slides[currentSlideIndex];
        const subslide = slide.content[currentSubslideIndex];
        console.log(slide, subslide)
        return { slide, subslide };
    }

    onSaveTranslatedText = value => {
        const { slide, subslide } = this.getCurrentSlideAndSubslide();

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
                <Grid.Row>
                    <Grid.Column width={12}>
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
                    <Grid.Column width={4}>
                        {translatableArticle && (
                            <SlidesList
                                currentSlideIndex={currentSlideIndex}
                                currentSubslideIndex={currentSubslideIndex}
                                slides={translatableArticle.slides}
                                onSubslideClick={this.onSlideChange}
                            />
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={12} mobile={16}>
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
                                    {translatableArticle && translatableArticle.slides[currentSlideIndex] && translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].audio && !recording && (
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
                                {translatableArticle && (
                                    <TranslateBox
                                        value={translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].text || ''}
                                        loading={false}
                                        onSave={this.onSaveTranslatedText}
                                    />
                                )}
                                {/* {this._renderSlideTranslateBox()} */}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={4}>
                    </Grid.Column>
                </Grid.Row>
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
    recordUploadLoading: translation.recordUploadLoading,
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
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticle);