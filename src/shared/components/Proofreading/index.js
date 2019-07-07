import React from 'react';
import { Grid, Dropdown, Button, TextArea } from 'semantic-ui-react';


function formatTime(seconds) {
    if (!seconds) return null;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    let time = minutes + ':' + seconds;

    return time.substr(0, 8);
}


class Proofreading extends React.Component {
    state = {
        article: null,
        currentSlideIndex: 0,
        selectedCutSubslide: 0,
    }
    componentWillReceiveProps = (nextProps) => {
        console.log('will recieve props')
        if ((this.props.article !== nextProps.article && nextProps.article) || (!this.state.article && nextProps.article)) {
            // Take a clone of the article for editing
            console.log('article')
            const { article } = nextProps;
            article.slides.forEach(slide => {
                slide.saved = true;
            });
            this.setState({ article: { ...article } })
        }
    }

    onChangeSubslideProperty(subslideIndex, proprety, value) {
        this.setState(({ article, currentSlideIndex }) => {
            article.slides[currentSlideIndex].content[subslideIndex][proprety] = value;
            article.slides[currentSlideIndex].saved = false;
            return { article };
        })
    }

    getSpeakersOptions = () => {
        return this.state.article.speakersProfile.map(speaker => ({ value: speaker.speakerNumber, text: `Speaker ${speaker.speakerNumber}` }))
    }

    setStartTime = () => {
        const currentVideoTime = this.videoRef.currentTime;
        const { selectedCutSubslide } = this.state;
        this.onChangeSubslideProperty(selectedCutSubslide, 'startTime', currentVideoTime)
    }

    setEndTime = () => {
        const currentVideoTime = this.videoRef.currentTime;
        const { selectedCutSubslide } = this.state;
        this.onChangeSubslideProperty(selectedCutSubslide, 'endTime', currentVideoTime)
    }

    onDeleteSubslide = (subslideIndex) => {
        this.setState(({ article, currentSlideIndex }) => {
            article.slides[currentSlideIndex].content.splice(subslideIndex, 1);
            return { article };
        })

    }
    onAddSubslide = () => {
        this.setState(({ article, currentSlideIndex }) => {
            article.slides[currentSlideIndex].content.push({
                startTime: '',
                endTime: '',
                speakerProfile: article.speakersProfile[0],
                text: '',
            });
            return { article };
        })
    }

    onSlideChange = (slideIndex) => {
        if (slideIndex < this.state.article.slides.length) {

            this.setState(({ article, currentSlideIndex }) => {
                const newSlide = article.slides[slideIndex];
                if (newSlide && newSlide.content && newSlide.content.length > 0) {
                    this.videoRef.currentTime = newSlide.content[0].startTime;
                }
                return { currentSlideIndex: slideIndex, selectedCutSubslide: 0 };
            })
        }
    }

    renderSubslides = () => {
        const { currentSlideIndex, article } = this.state;
        return (
            <React.Fragment>
                {article.slides[currentSlideIndex].content.map((subslide, subslideIndex) => (
                    <Grid.Row key={subslide._id}>
                        <Grid.Column width={3}>
                            <Dropdown
                                value={subslide.speakerProfile.speakerNumber}
                                onChange={(e, { value }) => {
                                    const speakerProfile = article.speakersProfile.find((sp) => sp.speakerNumber === value);
                                    this.onChangeSubslideProperty(subslideIndex, 'speakerProfile', speakerProfile);
                                }}
                                options={this.getSpeakersOptions()}
                            />
                            <div>
                                Start Time: <strong>{formatTime(subslide.startTime)}</strong>
                            </div>
                            <div>
                                End Time: <strong>{formatTime(subslide.endTime)}</strong>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <TextArea
                                style={{ width: '100%', height: 150, padding: 10 }}
                                value={subslide.text}
                                onChange={(e, { value }) => this.onChangeSubslideProperty(subslideIndex, 'text', value)}
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button icon="trash" color="red" onClick={() => this.onDeleteSubslide(subslideIndex)} />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                ))}
            </React.Fragment>
        )
    }

    render() {
        if (!this.state.article || !this.props.video) return 'loading...';
        const { article, currentSlideIndex } = this.state;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={13}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <video preload={false} src={this.props.video.url} width={'100%'} controls ref={videoRef => this.videoRef = videoRef} />
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Dropdown
                                                    onChange={(e, { value }) => this.setState({ selectedCutSubslide: value })}
                                                    value={this.state.selectedCutSubslide}
                                                    options={article.slides[currentSlideIndex].content.map((c, index) => ({ value: index, text: `Subslide ${index + 1}` }))}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Button onClick={this.setStartTime}>Set Start time</Button>
                                                <Button onClick={this.setEndTime}>Set End time</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Grid>
                                        {this.renderSubslides()}
                                        <Grid.Row>
                                            <Grid.Column width={12}></Grid.Column>
                                            <Grid.Column width={4}>
                                                <Button icon="plus" onClick={this.onAddSubslide} color="primary" />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={12}></Grid.Column>
                                            <Grid.Column width={4}>
                                                <Button onClick={this.onSave} color="green" > Save </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <ul style={{ maxHeight: 400, overflowY: 'scroll', border: '1px solid #eee' }}>
                            {this.state.article.slides.map((slide, index) => (
                                <li style={{ margin: 20, cursor: 'pointer' }} key={slide._id} onClick={() => this.onSlideChange(index)} >Slide {index + 1}</li>
                            ))}
                        </ul>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Proofreading;