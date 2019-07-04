import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';

const uploadVideoLoading = () => ({
    type: actionTypes.UPLOAD_VIDEO_LOADING
});

const uploadVideoProgress = progress => ({
    type: actionTypes.UPLOAD_VIDEO_PROGRESS,
    payload: progress,
})

const uploadVideoDone = result => ({
    type: actionTypes.UPLOAD_VIDEO_SUCCESS,
    payload: result,
})

const uploadVideoFailed = (error) => ({
    type: actionTypes.UPLOAD_VIDEO_FAILED,
    payload: error,
})

const fetchVideoLoading = () => ({
    type: actionTypes.FETCH_VIDEO_LOADING,
})

const fetchVideoSuccess = (video) => ({
    type: actionTypes.FETCH_VIDEO_SUCCESS,
    payload: video,
})

const fetchVideoFailed = (err) => ({
    type: actionTypes.FETCH_VIDEO_FAILED,
    payload: err,
})

export const uploadVideo = ({ title, numberOfSpeakers, video, langCode }) => (dispatch) => {
    dispatch(uploadVideoLoading());
    requestAgent
        .post(Api.video.uploadVideo)
        .field('title', title)
        .field('numberOfSpeakers', numberOfSpeakers)
        .field('langCode', langCode)
        .attach('video', video)
        .on('progress', function(e){
            dispatch(uploadVideoProgress(e.percent))
         })
        .then(res => {
            dispatch(uploadVideoDone(res.body));
        })
        .catch(err => {
            const reason = err.response ? err.response.text : 'Something went wrong';
            dispatch(uploadVideoFailed(reason));
        })
}

export const fetchVideoById = videoId => dispatch => {
    dispatch(fetchVideoLoading());
    requestAgent
    .get(Api.video.getVideoById(videoId))
    .then(res => {
        dispatch(fetchVideoSuccess(res.body));
    })
    .catch(err => {
        const reason = err.response ? err.response.text : 'Something went wrong';
        dispatch(fetchVideoFailed(reason));
    })
}