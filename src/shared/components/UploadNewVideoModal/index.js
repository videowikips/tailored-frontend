import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Tab, Icon } from 'semantic-ui-react';

import SingleUpload from './SingleUpload';
import MultipleUpload from './MultiUpload';

import { supportedLangs, isoLangsArray } from '../../constants/langs';
import { uploadVideo, setUploadVideoForm, uploadMultiVideos } from '../../../actions/video';

const speakersOptions = Array.apply(null, { length: 10 }).map(Number.call, Number).map((a, index) => ({ value: index + 1, text: index + 1 }));
let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true })).concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)))

const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} ) ${lang.supported ? ' < Automated >' : ''}` }));

const styles = {
    ModalCloseButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        boxShadow: 'none',
    }
}

class UploadNewVideoModal extends React.Component {
    state = {
        activeTabIndex: 0,
    }

    isSingleFormValid = () => {
        const { uploadVideoForm } = this.props;
        const { title, numberOfSpeakers, langCode, video } = uploadVideoForm;
        if (!title || !numberOfSpeakers || !langCode || !video) return false;
        return true;
    }

    isMultiFormValid = () => {
        const { uploadVideoForm } = this.props;
        const { videos } = uploadVideoForm;
        if (!videos || videos.length === 0) return false;
        return true;

    }

    isFormValid = () => {
        console.log('is form valid', this.state.activeTabIndex);
        return this.state.activeTabIndex === 0 ? this.isSingleFormValid() : this.isMultiFormValid();
    }

    onUploadFormChange = (changes) => {
        const { uploadVideoForm } = this.props;
        Object.keys(changes).forEach((key) => {
            uploadVideoForm[key] = changes[key];
        })
        this.props.setUploadVideoForm({ ...uploadVideoForm });
    }

    onSubmit = (values) => {
        if (this.state.activeTabIndex === 0) {
            this.props.uploadVideo({ ...values, organization: this.props.organization._id });
        } else {
            this.props.uploadMultiVideos({ ...values, organization: this.props.organization._id });
        }
    }

    render() {
        console.log('this.props.valid', this.props.valid)
        const tabItems = [
            {
                menuItem: 'Single',
                render: () =>
                    <Tab.Pane style={{ minHeight: 500 }}>
                        <SingleUpload {...this.props} onChange={this.onUploadFormChange} value={this.props.uploadVideoForm} onSubmit={this.onSubmit} langsOptions={langsOptions} speakersOptions={speakersOptions} />
                    </Tab.Pane>
            },
            {
                menuItem: 'Multiple',
                render: () =>
                    <Tab.Pane style={{ minHeight: 500 }}>
                        <MultipleUpload {...this.props} onChange={this.onUploadFormChange} value={this.props.uploadVideoForm} onSubmit={this.onSubmit} langsOptions={langsOptions} speakersOptions={speakersOptions} />
                    </Tab.Pane>
            }
        ]
        return (
            <Modal open={this.props.open} size="large" className={"upload-modal"} onClose={this.props.onClose} >
                <Modal.Header>
                    Upload a new video <Button icon="close" basic style={styles.ModalCloseButton} onClick={this.props.onClose} />
                </Modal.Header>
                <Modal.Content>
                    <Tab
                        activeIndex={this.state.activeTabIndex}
                        // activeIndex={this.state.activeIndex}
                        onTabChange={(e, { activeIndex }) => this.setState({ activeTabIndex: activeIndex })}
                        panes={tabItems}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={this.props.onClose} size={'large'}>Cancel</Button>
                        <Button onClick={() => this.onSubmit(this.props.uploadVideoForm)} icon="upload" disabled={!(this.isFormValid() && !this.props.loading)} loading={this.props.loading} primary size={'large'}>
                            <Icon name="upload" />
                            Upload
                    </Button>
                    </div>
                </Modal.Actions>
            </Modal>
        )
    }
}

UploadNewVideoModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    uploadProgress: PropTypes.number,
}

UploadNewVideoModal.defaultProps = {
    open: false,
    uploadProgress: 0,
    onClose: () => { },
}

const mapStateToProps = ({ video, organization }) => ({
    uploadProgress: video.uploadProgress,
    loading: video.uploadState === 'loading',
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    uploadVideoForm: { ...video.uploadVideoForm },
    video: video.video,
    organization: organization.organization,
})

const mapDispatchToProps = (dispatch) => ({
    uploadMultiVideos: values => dispatch(uploadMultiVideos(values)),
    uploadVideo: values => dispatch(uploadVideo(values)),
    setUploadVideoForm: uploadVideoForm => dispatch(setUploadVideoForm(uploadVideoForm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadNewVideoModal);
