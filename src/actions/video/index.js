import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { generateConvertStages, matchVideosWithSubtitels, removeExtension } from '../../shared/utils/helpers';
import NotificationService from '../../shared/utils/NotificationService';
import { push } from 'connected-react-router';
import routes from '../../shared/routes';
import asyncSeries from 'async/series';

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

export const setUploadVideoForm = uploadVideoForm => ({
    type: actionTypes.SET_UPLOAD_VIDEO_FORM,
    payload: uploadVideoForm,
})

export const reset = () => ({
    type: actionTypes.RESET,
})

export const resetUploadVideoForm = () => ({
    type: actionTypes.RESET_UPLOAD_VIDEO_FORM
})

export const uploadMultiVideos = ({ videos, subtitles, organization }) => (dispatch, getState) => {
    const { uploadVideoForm } = getState().video;
    dispatch(uploadVideoLoading());
    videos = matchVideosWithSubtitels(videos, subtitles);
    const uploadVideoFuncArray = [];
    videos.forEach(video => {
        uploadVideoFuncArray.push((cb) => {
            const { numberOfSpeakers, langCode, content } = video;
            const req = requestAgent
            .post(Api.video.uploadVideo)
            .field('title', removeExtension(content.name))
            .field('numberOfSpeakers', numberOfSpeakers)
            .field('langCode', langCode)
            .field('organization', organization || '')
            .attach('video', content)
            if (video.subtitle) {
                req.attach('subtitle', video.subtitle.content);
            }
    
            req.on('progress', function (e) {
                if (e.percent) {
                    dispatch(uploadVideoProgress(e.percent))
                    video.progress = e.percent;
                    dispatch(setUploadVideoForm({ ...uploadVideoForm, videos }));
                }
            })
            .then(res => {
                video.percent = 100;
                dispatch(setUploadVideoForm({ ...uploadVideoForm, videos }));
                cb(null, res.body);
            })
            .catch(err => {
                const reason = err.response ? err.response.text : 'Something went wrong';
                cb(reason);
            })
        })
    })
    asyncSeries(uploadVideoFuncArray, (err, result) => {
        if (err) {
            dispatch(uploadVideoFailed(err));
        } else {
            dispatch(uploadVideoDone(result[0]));
            dispatch(resetUploadVideoForm());
        }
    })
}

export const uploadVideo = ({ title, numberOfSpeakers, video, langCode, organization, subtitle }) => (dispatch) => {
    dispatch(uploadVideoLoading());
    const req = requestAgent
        .post(Api.video.uploadVideo)
        .field('title', title)
        .field('numberOfSpeakers', numberOfSpeakers)
        .field('langCode', langCode)
        .field('organization', organization || '')
        .attach('video', video)
        if (subtitle) {
            req.attach('subtitle', subtitle);
        }

        req.on('progress', function (e) {
            dispatch(uploadVideoProgress(e.percent))
        })
        .then(res => {
            dispatch(uploadVideoDone(res.body));
            dispatch(resetUploadVideoForm());
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

export const convertVideoToArticle = (videoId, articleId, toEnglish) => (dispatch, getState) => {
    requestAgent
        .post(Api.video.convertVideo(videoId), { articleId, toEnglish })
        .then(res => {
            console.log(res);
            const { stages } = getState().video.convertStages;
            stages[0].completed = true;
            stages[1].completed = true;
            stages[2].active = true;
            dispatch(push(`${routes.organziationReview()}?activeTab=proofread`))
            dispatch(setStages(stages, 2));
        })
        .catch((err) => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            NotificationService.error(reason);
        })
}

export const fetchOrganizationVideos = organizationId => dispatch => {
    dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_LOADING });
    requestAgent
    .get(Api.video.getOrganizationVideos(organizationId))
    .then((res) => {
        const { videos } = res.body;
        dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_SUCCESS, payload: videos });
    })
    .catch((err) => {
        NotificationService.responseError(err);
        dispatch({ type: actionTypes.FETCH_ORGANIZATION_VIDEOS_FAILED });
    })
}

export const setOrganizationVideosActiveTabIndex = index => ({
    type: actionTypes.SET_ORGANIZATION_VIDEOS_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setOrganizationVideosTabs = tabs => ({
    type: actionTypes.SET_ORGANIZATION_VIDEOS_TABS,
    payload: tabs,
})