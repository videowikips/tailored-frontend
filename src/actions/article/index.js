import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import { SPEAKER_BACKGROUND_COLORS } from '../../shared/constants';
import NotificationService from '../../shared/utils/NotificationService';

function formatSubslideToSubtitle(subslide) {
    return ({ ...subslide, startTime: subslide.startTime * 1000, endTime: subslide.endTime * 1000, text: subslide.text, speakerNumber: subslide.speakerProfile.speakerNumber, backgroundColor: SPEAKER_BACKGROUND_COLORS[subslide.speakerProfile.speakerNumber] })
}

function generateSubtitlesFromSlides(slides) {
    return slides.reduce((acc, slide, slideIndex) => acc.concat(slide.content.map((s, subslideIndex) => ({ ...s, slideIndex, subslideIndex }))), [])
        .filter((s) => !s.silent)
        .map(formatSubslideToSubtitle);
}

const fetchArticleLoading = () => ({
    type: actionTypes.FETCH_ARTICLE_LOADING,
})

const setArticle = article => ({
    type: actionTypes.SET_ARTICLE,
    payload: article,
})

const fetchArticleSuccess = article => ({
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    payload: article,
})

const fetchArticleFailed = (err) => ({
    type: actionTypes.FETCH_ARTICLE_FAILED,
    payload: err,
})

const updateSubslideLoading = () => ({
    type: actionTypes.UPDATE_SUBSLIDE_LOADING,
})

const updateSubslideSuccess = (updatedArticle) => ({
    type: actionTypes.UPDATE_SUBSLIDE_SUCCESS,
    payload: updatedArticle
})

const updateSubslideFailed = (err) => ({
    type: actionTypes.UPDATE_SUBSLIDE_FAILED,
    payload: err,
})

export const setToEnglish = toEnglish => ({
    type: actionTypes.SET_TO_ENGLISH,
    payload: toEnglish,
})

export const setSubtitles = (subtitles) => ({
    type: actionTypes.SET_SUBTITLES,
    payload: [...subtitles],
})

export const setSelectedSubtitle = (subtitle, subtitleIndex) => ({
    type: actionTypes.SET_SELECTED_SUBTITLE,
    payload: {
        subtitle,
        subtitleIndex
    }
})

export const setSlidesToSubtitles = (slides) => {
    const subtitles = generateSubtitlesFromSlides(slides);
    return setSubtitles(subtitles);
}

export const fetchArticleById = id => dispatch => {
    dispatch(fetchArticleLoading());
    requestAgent
        .get(Api.article.getById(id))
        .then((res) => {
            console.log('res', res.body)
            const { article } = res.body;
            dispatch(fetchArticleSuccess(article));
        })
        .catch(err => {
            console.log(err)
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(fetchArticleFailed(reason));
        })
}

export const fetchArticleByVideoId = videoId => dispatch => {
    dispatch(fetchArticleLoading());
    requestAgent
        .get(Api.article.getbyVideoId(videoId))
        .then((res) => {
            const article = res.body;
            dispatch(fetchArticleSuccess(article));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(fetchArticleFailed(reason));
        })
}

export const deleteSubslide = (slideIndex, subslideIndex) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };
    console.log(article);
    requestAgent
        .delete(Api.article.deleteSubslide(article._id, slideIndex, subslideIndex))
        .then((res) => {
            // const article = res.body;
            article.slides[slideIndex].content.splice(subslideIndex, 1);
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));
            dispatch(setSelectedSubtitle(null, null));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)
            dispatch(updateSubslideFailed(reason));
        })
}

export const updateSubslide = (slideIndex, subslideIndex, changes) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };
    const { selectedSubtitle } = getState().article;
    requestAgent
        .patch(Api.article.updateSubslide(article._id, slideIndex, subslideIndex), changes)
        .then((res) => {
            // const article = res.body;
            Object.keys(res.body.changes).forEach(key => {
                article.slides[slideIndex].content[subslideIndex][key] = res.body.changes[key];
                if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                    selectedSubtitle.subtitle[key] = res.body.changes[key];
                }
            })
            if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                dispatch(setSelectedSubtitle({ ...selectedSubtitle.subtitle }, selectedSubtitle.subtitleIndex));
            }
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));

        })
        .catch(err => {
            console.log(err);
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)
            dispatch(updateSubslideFailed(reason));
        })
}

export const splitSubslide = (slideIndex, subslideIndex, wordIndex) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState().article.article };

    requestAgent
    .post(Api.article.splitSubslide(article._id, slideIndex, subslideIndex), { wordIndex })
    .then((res) => {
        const { article } = res.body;
        dispatch(updateSubslideSuccess(article));
        dispatch(setArticle(article));
        dispatch(setSlidesToSubtitles(article.slides));
        dispatch(setSelectedSubtitle(null, null));

    })
    .catch(err => {

        const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
        NotificationService.responseError(err)
        dispatch(updateSubslideFailed(reason));
    })

}

export const addSubslide = (subslide) => (dispatch, getState) => {
    const article = { ...getState().article.article };
    const { slideIndex, subslideIndex } = subslide;
    console.log('subslide', subslide)
    requestAgent
        .post(Api.article.addSubslide(article._id, slideIndex, subslideIndex), subslide)
        .then((res) => {
            // const article = res.body;
            const { article } = res.body;
            const subtitles = generateSubtitlesFromSlides(article.slides)
            const selectedSubtitleIndex = subtitles.findIndex((s) => s.slideIndex === slideIndex && s.subslideIndex === subslideIndex);

            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));
            dispatch(setSelectedSubtitle(subtitles[selectedSubtitleIndex], selectedSubtitleIndex));

        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err);
            dispatch(updateSubslideFailed(reason));
        })
}

export const updateSpeakers = speakersProfile => (dispatch, getState) => {
    const article = { ...getState().article.article };
    requestAgent
        .put(Api.article.updateSpeakers(article._id), { speakersProfile })
        .then((res) => {
            article.speakersProfile = speakersProfile;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
        })
}