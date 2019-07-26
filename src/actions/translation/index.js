import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';
import NotificationService from '../../shared/utils/NotificationService';

const setOriginalArticle = payload => ({
    type: actionTypes.SET_ORIGINAL_ARTICLE,
    payload,
})

const setTranslatableArticle = (payload) => ({
    type: actionTypes.SET_TRANSLATABLE_ARTICLE,
    payload,
})

const setRecordUploadLoading = loading => ({
    type: actionTypes.SET_RECORD_UPLOAD_LOADING,
    payload: loading,
})

export const setRecording = recording => ({
    type: actionTypes.SET_TRANSLATION_RECORDING,
    payload: recording,
})

export const setCurrentEditorIndexes = payload => ({
    type: actionTypes.SET_CURRENT_EDITOR_INDEXES,
    payload,
})

export const setCurrentSlideIndex = payload => ({
    type: actionTypes.SET_CURRENT_SLIDE_INDEX,
    payload,
})

export const setCurrentSubslideIndex = payload => ({
    type: actionTypes.SET_CURRENT_SUBSLIDE_INDEX,
    payload,
})

export const setEditorPlaying = playing => ({
    type: actionTypes.SET_EDITOR_PLAYING,
    payload: playing,
})

export const setEditorMuted = muted => ({
    type: actionTypes.SET_EDITOR_MUTED,
    payload: muted,
})

export const fetchTranslatableArticle = (originalArticleId, lang) => dispatch => {
    dispatch(setOriginalArticle(null));
    dispatch(setTranslatableArticle(null));
    requestAgent
    .get(`${Api.translate.getTranslatableArticle(originalArticleId)}?lang=${lang}`)
    .then((res) => {
        const { article, originalArticle } = res.body;
        dispatch(setOriginalArticle(originalArticle));
        dispatch(setTranslatableArticle(article));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const saveTranslatedText = (slidePosition, subslidePosition, text) => (dispatch, getState) => {
    const { translatableArticle } = getState().translation
    requestAgent
    .post(Api.translate.addTranslatedText(translatableArticle._id), { slidePosition, subslidePosition, text })
    .then((res) => {
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex].text = text;
        dispatch(setTranslatableArticle({ ...translatableArticle }));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const saveRecordedTranslation = (slidePosition, subslidePosition, blob) => (dispatch, getState) => {
    dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState().translation
    requestAgent.post(Api.translate.addRecordedTranslation(translatableArticle._id))
    .field('slidePosition', slidePosition)
    .field('subslidePosition', subslidePosition)
    .field('file', blob)
    .then((res) => {
        console.log(res)
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex].audio = res.body.audio;
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(setRecordUploadLoading(false));

    })
    .catch((err) => {
        console.log(err);
        dispatch(setRecordUploadLoading(false));
        NotificationService.responseError(err);
    })
}


export const deleteRecordedTranslation = (slidePosition, subslidePosition) => (dispatch, getState) => {
    dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState().translation
    requestAgent.delete(Api.translate.deleteRecordedTranslation(translatableArticle._id), { slidePosition, subslidePosition })
    .then((res) => {
        console.log(res)
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex].audio = res.body.audio || '';
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(setRecordUploadLoading(false));

    })
    .catch((err) => {
        console.log(err);
        dispatch(setRecordUploadLoading(false));
        NotificationService.responseError(err);
    })
}
