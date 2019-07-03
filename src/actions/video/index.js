import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import NotificationService from '../../shared/utils/NotificationService';

const uploadVideoLoading = {
    type: actionTypes.UPLOAD_VIDEO_LOADING
};

const uploadVideoProgress = progress => ({
    type: actionTypes.UPLOAD_VIDEO_PROGRESS,
    payload: progress,
})

const uploadVideoDone = result => ({
    type: actionTypes.UPLOAD_VIDEO_SUCCESS,
    payload: result,
})

const uploadVideoFailed = {
    type: actionTypes.UPLOAD_VIDEO_FAILED,
}

export const uploadVideo = ({ title, numberOfSpeakers, video, langCode }) => (dispatch) => {
    dispatch(uploadVideoLoading);
    requestAgent
        .post(
            Api.video.uploadVideo,
        )
        .field('title', title)
        .field('numberOfSpeakers', numberOfSpeakers)
        .field('langCode', langCode)
        .attach('video', video)
        .on('progress', function(e){
            dispatch(uploadVideoProgress(e.percent))
         })
        .then(res => {
            NotificationService.success('Uploaded successfully');
            dispatch(uploadVideoDone(res.body));
        })
        .catch(err => {
            const reason = err.response ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(uploadVideoFailed)
        })
}