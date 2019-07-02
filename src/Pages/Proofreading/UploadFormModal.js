import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Input, Grid, Dropdown, Progress } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { isoLangsArray } from '../../shared/constants/langs';
import * as videoActions from '../../actions/video';
const speakersOptions = Array.apply(null, { length: 10 }).map(Number.call, Number).map((a, index) => ({ value: index + 1, text: index + 1 }));
const langsOptions = isoLangsArray.map((lang) => ({ value: lang.code, text: `${lang.name} (${lang.nativeName})` }));

const styles = {
    ModalCloseButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        boxShadow: 'none',
    }
}

class UploadFormModal extends React.Component {
    state = {
        title: '',
        numberOfSpeakers: 1,
        langCode: 'en',
        valid: false,
        video: null,
    };

    onSubmit = () => {
        console.log('on submit')
        if (this.state.valid) {
            this.props.uploadVideo(this.state);
        }
    }

    onFieldChange = (e, { name, value }) => {
        this.setState({ [name]: value }, () => {
            this.validateForm();
        })
    }

    validateForm = () => {
        const { title, numberOfSpeakers, langCode, valid } = this.state;
        if ((!title || !numberOfSpeakers || !langCode) && valid) return this.setState({ valid: false });
        if (!valid) {
            this.setState({ valid: true })
        }
    }

    onVideoChange = (file) => {
        const reader = new FileReader()
        console.log('on video change', file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            this.setState({ fileContent: reader.result });
        }
        reader.readAsDataURL(file)
    }
    onVideoDrop = (accpetedFiles) => {
        console.log(accpetedFiles);
        if (accpetedFiles.length > 0) {
            this.setState({ video: accpetedFiles[0] }, () => {
                this.onVideoChange(accpetedFiles[0])
            })
        }
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
                            {this.state.fileContent ? (
                                <video src={this.state.fileContent} width={'100%'} controls />
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
        return (
            <Modal open={this.props.open} size="small" className={"upload-modal"} onClose={this.props.onClose} >
                <Modal.Header>
                    Upload a new video <Button icon="close" basic style={styles.ModalCloseButton} onClick={this.props.onClose} />
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {this.renderDropzone()}
                            </Grid.Column>
                            {this.props.uploadState === 'loading' && (
                                <Grid.Column width={16}>
                                    <Progress percent={Math.floor(this.props.uploadProgress)} indicating progress />
                                </Grid.Column>
                            )}
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                Title
                                </Grid.Column>
                            <Grid.Column width={10}>
                                <Input fluid type="text" value={this.state.title} onChange={this.onFieldChange} name="title" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                No. of speakers
                                </Grid.Column>
                            <Grid.Column width={10}>
                                <Dropdown
                                    scrolling
                                    value={this.state.numberOfSpeakers}
                                    onChange={this.onFieldChange}
                                    name="numberOfSpeakers"
                                    options={speakersOptions}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                Language
                                </Grid.Column>
                            <Grid.Column width={10}>
                                <Dropdown
                                    search
                                    selection
                                    fluid
                                    value={this.state.langCode}
                                    onChange={this.onFieldChange}
                                    name="langCode"
                                    options={langsOptions}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={this.onSubmit} disabled={!this.state.valid || this.props.uploadState === 'loading'} loading={this.props.uploadState === 'loading'} primary size={'large'}>Submit</Button>
                    </div>
                </Modal.Actions>
            </Modal>
        )
    }
}

UploadFormModal.propTypes = {
    open: PropTypes.bool,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    uploadProgress: PropTypes.number,
}

UploadFormModal.defaultProps = {
    open: false,
    uploadProgress: 0,
    onSubmit: () => { },
    onClose: () => { },
}

const mapStateToProps = ({ video }) => ({
    uploadProgress: video.uploadProgress,
    uploadState: video.uploadState,
})

const mapDispatchToProps = dispatch => ({
    uploadVideo: (params) => dispatch(videoActions.uploadVideo(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormModal);
