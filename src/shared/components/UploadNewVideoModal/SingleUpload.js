import React from 'react';
import { Grid, Dropdown, Progress, Input, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';

class SingleUpload extends React.Component {

    onSubmit = () => {
        this.props.onSubmit(this.props.value);
    }

    onFieldChange = (e, { name, value, checked }) => {
        console.log('on change', name, value, checked)
        if (name === 'withSubtitle') {
            this.props.onChange({ [name]: checked })
        } else {
            this.props.onChange({ [name]: value })
        }
    }

    onSubtitleChange = (file) => {
        if (file) {
            this.props.onChange({ withSubtitle: true });
            this.props.onChange({ subtitle: file });
        } else {
            this.props.onChange({ withSubtitle: false });
            this.props.onChange({ subtitle: null });
        }
    }

    onVideoChange = (file) => {
        const reader = new FileReader()
        console.log('on video change', file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            this.props.onChange({ fileContent: reader.result });
        }
        reader.readAsDataURL(file)
    }

    onVideoDrop = (accpetedFiles) => {
        if (accpetedFiles.length > 0) {
            this.props.onChange({ video: accpetedFiles[0] });
            this.onVideoChange(accpetedFiles[0]);
        }
    }

    renderRequiredStar = () => {
        return (
            <span style={{ color: 'red' }}>*</span>
        )
    }

    renderDropzone = () => {
        return (
            <Dropzone
                multiple={false}
                // disablePreview={true}
                accept="video/*"
                onDrop={this.onVideoDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.props.value.fileContent ? (
                                <video src={this.props.value.fileContent} width={'100%'} controls />
                            ) : (
                                    <div className="dropbox">
                                        <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
                                    </div>
                                )}
                            <p style={{ textAlign: 'center' }}>Choose a video or drag it here.</p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }

    render() {
        const { langsOptions, speakersOptions } = this.props;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {this.renderDropzone()}
                    </Grid.Column>
                    {this.props.uploadProgress ? (
                        <Grid.Column width={16}>
                            <Progress percent={Math.floor(this.props.uploadProgress)} indicating progress />
                        </Grid.Column>
                    ) : null}
                </Grid.Row>
                <Grid.Row className="form-group">
                    <Grid.Column width={3} className="label">
                        Title {this.renderRequiredStar()}
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Input fluid type="text" value={this.props.value.title} onChange={this.onFieldChange} name="title" />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="form-group">
                    <Grid.Column width={3} className="label">
                        No. of speakers {this.renderRequiredStar()}
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Dropdown
                            scrolling
                            value={this.props.value.numberOfSpeakers}
                            onChange={this.onFieldChange}
                            name="numberOfSpeakers"
                            options={speakersOptions}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="form-group">
                    <Grid.Column width={3} className="label">
                        Language {this.renderRequiredStar()}
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <Dropdown
                            search
                            selection
                            fluid
                            value={this.props.value.langCode}
                            onChange={this.onFieldChange}
                            name="langCode"
                            options={langsOptions}
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row className="form-group">
                    <Grid.Column width={3}>
                        Transcript
                        </Grid.Column>
                    <Grid.Column width={12} className="label">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="file"
                                accept=".srt, .vtt"
                                value={this.props.subtitle}
                                ref={(ref) => this.subtitleRef = ref}
                                onChange={(e) => {
                                    // console.log()
                                    this.onSubtitleChange(e.target.files[0]);
                                }}
                            />
                            {this.props.value.subtitle && (
                                <Button icon="close" onClick={() => {
                                    this.onSubtitleChange(null);
                                    this.subtitleRef.value = null;
                                }} basic style={{ boxShadow: 'none', marginLeft: 20 }} />
                            )}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default SingleUpload;
