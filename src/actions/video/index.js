import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { generateConvertStages } from '../../shared/utils/helpers';
import NotificationService from '../../shared/utils/NotificationService';

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

const setStages = (stages, activeStageIndex) => ({
    type: actionTypes.SET_STAGES,
    payload: { stages, activeStageIndex },
})

export const uploadVideo = ({ title, numberOfSpeakers, video, langCode }) => (dispatch) => {
    dispatch(uploadVideoLoading());
    requestAgent
        .post(Api.video.uploadVideo)
        .field('title', title)
        .field('numberOfSpeakers', numberOfSpeakers)
        .field('langCode', langCode)
        .attach('video', video)
        .on('progress', function (e) {
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
            const video = res.body;
            const stages = generateConvertStages();
            let activeStageIndex = 0;
            switch (video.status) {
                case 'proofreading':
                    stages[0].completed = true;
                    stages[1].active = true;
                    activeStageIndex = 1;
                    break;
                case 'converting':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].active = true;
                    activeStageIndex = 2;
                    break;
                case 'done':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].completed = true;
                    stages[0].active = true;
                    stages[1].active = true;
                    stages[2].active = true;
                    activeStageIndex = 3;
                    break;
                default:
                    stages[0].active = true;
            }
            dispatch(fetchVideoSuccess(video));
            dispatch(setStages(stages, activeStageIndex));
        })
        .catch(err => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            dispatch(fetchVideoFailed(reason));
        })
}

export const convertVideoToArticle = (videoId) => (dispatch, getState) => {
    requestAgent
        .post(Api.video.convertVideo(videoId))
        .then(res => {
            console.log(res);
            const { stages } = getState().video.convertStages;
            stages[0].completed = true;
            stages[1].completed = true;
            stages[2].active = true;

            dispatch(setStages(stages, 2));
        })
        .catch((err) => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            NotificationService.error(reason);
        })
}