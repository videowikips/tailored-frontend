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

    onSaveTranslatedText = value => {
        const { translatableArticle, currentSlideIndex, currentSubslideIndex } = this.props;
        const slide = translatableArticle.slides[currentSlideIndex];
        const subslide = slide.content[currentSubslideIndex];
        console.log(slide, subslide)
        this.props.saveTranslatedText(slide.position, subslide.position, value);
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
        const { originalArticle, translatableArticle, currentSlideIndex, currentSubslideIndex, recording } = this.props;
        translatableArticle && console.log(translatableArticle.slides[currentSlideIndex].content[currentSubslideIndex].text)
        return (
            <Grid style={{ width: '100%' }}>
                <Grid.Row>
                    <Grid.Column width={12}>
                        {originalArticle && (
                            <Editor
                                controlled
                                currentSlideIndex={currentSlideIndex}
                                currentSubslideIndex={currentSubslideIndex}
                                article={originalArticle}
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
                                        iconPosition="left"
                                        loading={false}
                                        //   disabled={!this.canRecord()}
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
                                    {translatableArticle && translatableArticle.slides[currentSlideIndex] && translatableArticle.slides[currentSlideIndex].audio && !recording && (
                                        <div className="c-export-human-voice__audio_container" >
                                            <audio
                                                controls
                                                onPlay={() => this.setState({ isPlaying: true, editorMuted: true })}
                                                onPause={() => this.setState({ isPlaying: false, editorMuted: false })}
                                                onEnded={() => this.setState({ isPlaying: false, editorMuted: false })}
                                            >
                                                <source src={translatableArticle.slides[currentSlideIndex].audio} />
                                                Your browser does not support the audio element.
                                            </audio>
                                            <Icon name="close" className="c-export-human-voice__clear-record" onClick={() => this.onDeleteAudio(currentSlideIndex)} />
                                        </div>
                                    )}
                                    <div className="c-export-human-voice__recorder-mic-container" style={{ 'visibility': recording ? 'visible' : 'hidden' }} >
                                        <AudioRecorder
                                            record={recording}
                                            className="c-export-human-voice__recorder-mic"
                                            onStop={this.onStop}
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
    originalArticle: translation.originalArticle,
    translatableArticle: translation.translatableArticle,
    recording: translation.recording,
    currentSlideIndex: translation.currentSlideIndex,
    currentSubslideIndex: translation.currentSubslideIndex,
})
const mapDispatchToProps = dispatch => ({
    fetchTranslatableArticle: (originalArticleId, lang) => dispatch(translationActions.fetchTranslatableArticle(originalArticleId, lang)),
    setCurrentSlideIndex: index => dispatch(translationActions.setCurrentSlideIndex(index)),
    setCurrentSubslideIndex: index => dispatch(translationActions.setCurrentSubslideIndex(index)),
    setCurrentEditorIndexes: indexes => dispatch(translationActions.setCurrentEditorIndexes(indexes)),
    saveTranslatedText: (slidePositon, subslidePosition, text) => dispatch(translationActions.saveTranslatedText(slidePositon, subslidePosition, text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TranslateArticle);