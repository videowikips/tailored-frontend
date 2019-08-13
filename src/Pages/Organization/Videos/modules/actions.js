import { push } from 'connected-react-router';
import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import routes from '../../../../shared/routes';


export const setCurrentPageNumber = pageNumber => ({
    type: actionTypes.SET_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const setTotalPagesCount = pagesCount => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: pagesCount,
})

export const setActiveTabIndex = index => ({
    type: actionTypes.SET_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setLanguageFilter = lang => ({
    type: actionTypes.SET_LANGUAGE_FILTER,
    payload: lang,
})

export const setVideoLoading = loading => ({
    type: actionTypes.SET_VIDEO_LOADING,
    payload: loading
})

export const setVideos = videos => ({
    type: actionTypes.SET_VIDEOS,
    payload: videos,
})

export const setSelectedVideo = video => ({
    type: actionTypes.SET_SELECTED_VIDEO,
    payload: video,
})

export const setAddHumanVoiceModalVisible = visible => ({
    type: actionTypes.SET_ADD_HUMAN_VOICE_MODAL_VISIBLE,
    payload: visible,
})

export const setTranslatedArticles = translatedArticles => ({
    type: actionTypes.SET_TRANSLATED_ARTICLES,
    payload: translatedArticles,
})

export const fetchVideos = ({ organization, langCode, status, page }) => (dispatch, getState) => {
    // const { }
    dispatch(setVideoLoading(true));
    dispatch(setVideos([]))
    requestAgent
        .get(Api.video.getVideos({ organization, langCode, status, page }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setVideos(videos));
            dispatch(setVideoLoading(false))
            if (pagesCount) {
                dispatch(setTotalPagesCount(pagesCount));
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const fetchTranslatedArticles = (organization, page) => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    dispatch(setTranslatedArticles([]))
    requestAgent
        .get(Api.article.getTranslatedArticles({ organization, page }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setTranslatedArticles(videos));
            dispatch(setVideoLoading(false))
            if (pagesCount) {
                dispatch(setTotalPagesCount(pagesCount));
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}

export const reviewVideo = video => (dispatch, getState) => {
    dispatch(setVideoLoading(true));
    requestAgent
        .post(Api.video.reviewVideo(video._id))
        .then((res) => {
            console.log(res);
            dispatch(push(routes.convertProgress(video._id)));
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setVideoLoading(false))
        })
}