import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input, Grid, Dropdown, Progress } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { supportedLangs } from '../constants/langs';
const speakersOptions = Array.apply(null, { length: 10 }).map(Number.call, Number).map((a, index) => ({ value: index + 1, text: index + 1 }));
const langsOptions = supportedLangs.map((lang) => ({ value: lang.code, text: `${lang.name} ( ${lang.code} )` }));
console.log(langsOptions)
const styles = {
    ModalCloseButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        boxShadow: 'none',
    }
}

class UploadNewVideoModal extends React.Component {

    onSubmit = () => {
        this.props.onSubmit(this.props.value);
    }

    onFieldChange = (e, { name, value }) => {
        this.props.onChange({ [name]: value })
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
        console.log('this.props.valid', this.props.valid)
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
                            {this.props.uploadProgress ? (
                                <Grid.Column width={16}>
                                    <Progress percent={Math.floor(this.props.uploadProgress)} indicating progress />
                                </Grid.Column>
                            ) : null}
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                Title
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Input fluid type="text" value={this.props.value.title} onChange={this.onFieldChange} name="title" />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                No. of speakers
                                </Grid.Column>
                            <Grid.Column width={10}>
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
                                Language
                            </Grid.Column>
                            <Grid.Column width={10}>
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
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={this.onSubmit} disabled={!this.props.valid} loading={this.props.loading} primary size={'large'}>Submit</Button>
                    </div>
                </Modal.Actions>
            </Modal>
        )
    }
}

UploadNewVideoModal.propTypes = {
    open: PropTypes.bool,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    uploadProgress: PropTypes.number,
}

UploadNewVideoModal.defaultProps = {
    open: false,
    uploadProgress: 0,
    onSubmit: () => { },
    onClose: () => { },
}


export default UploadNewVideoModal;
