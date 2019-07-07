import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as videoActions from '../../actions/video';

import UploadNewVideoModal from '../../shared/components/UploadNewVideoModal';
import NotificationService from '../../shared/utils/NotificationService';

class Demo extends React.Component {

    state = {
        uploadFormOpen: false,
        videoForm: {
            title: '',
            numberOfSpeakers: 1,
            langCode: 'en-US',
            video: null,
            fileContent: null,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'done') {
            NotificationService.success('Uploaded successfully');
            this.setState({ uploadFormOpen: false });
            this.props.history.push(`/convert/${nextProps.video._id}`);
        }
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'failed') {
            NotificationService.error(nextProps.uploadError);
            this.setState({ uploadFormOpen: false });
        }
    }

    onUploadFormChange = (changes) => {
        console.log('on change', changes)
        this.setState(state => {
            const { videoForm } = state;
            Object.keys(changes).forEach((key) => {
                videoForm[key] = changes[key];
            })
            return { videoForm };
        });
    }

    onSubmit = (values) => {
        this.props.uploadVideo(values);
    }

    isFormValid = () => {
        const { videoForm } = this.state;
        const { title, numberOfSpeakers, langCode, video } = videoForm;
        if (!title || !numberOfSpeakers || !langCode || !video) return false;
        return true;
    }

    render() {
        console.log('is form valid', this.isFormValid())
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <button onClick={() => this.setState({ uploadFormOpen: !this.state.uploadFormOpen })}>Upload</button>
                    </Grid.Column>
                </Grid.Row>
                <UploadNewVideoModal
                    open={this.state.uploadFormOpen}
                    onClose={() => this.setState({ uploadFormOpen: false })}
                    onChange={this.onUploadFormChange}
                    onSubmit={this.onSubmit}
                    value={this.state.videoForm}
                    valid={this.isFormValid() && this.props.uploadState !== 'loading'}
                    loading={this.props.uploadState === 'loading'}
                    uploadProgress={this.props.uploadProgress}
                />
            </Grid>
        )
    }
}

const mapStateToProps = ({ video }) => ({
    uploadProgress: video.uploadProgress,
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    video: video.video,
})

const mapDispatchToProps = dispatch => ({
    uploadVideo: (params) => dispatch(videoActions.uploadVideo(params))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Demo)
);