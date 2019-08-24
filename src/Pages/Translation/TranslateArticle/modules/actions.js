import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';
import _ from 'lodash';
import { push } from 'connected-react-router';
import routes from '../../../../shared/routes';

const moduleName = 'translateArticle';



const setLaoding = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading,
})

const setTranslationExports = translationExports => ({
    type: actionTypes.SET_TRANSLATION_EXPORTS,
    payload: translationExports,
})

const setOriginalArticle = payload => ({
    type: actionTypes.SET_ORIGINAL_ARTICLE,
    payload,
})

const setTranslatableArticle = (payload) => ({
    type: actionTypes.SET_TRANSLATABLE_ARTICLE,
    payload,
})

const setOriginalTranslatableArticle = (payload) => ({
    type: actionTypes.SET_ORIGINAL_TRANSLATABLE_ARTICLE,
    payload,
})

const setOriginalViewedArticle = payload => ({
    type: actionTypes.SET_ORIGINAL_VIEWED_ARTICLE,
    payload,
})

const setRecordUploadLoading = loading => ({
    type: actionTypes.SET_RECORD_UPLOAD_LOADING,
    payload: loading,
})

export const setExportHistoryPageNumber = pageNumber => ({
    type: actionTypes.SET_EXPORT_HISTORY_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const setExportHistoryTotalPages = pagesCount => ({
    type: actionTypes.SET_EXPORT_HISTORY_TOTAL_PAGES,
    payload: pagesCount,
})

export const setActiveTabIndex = index => ({
    type: actionTypes.SET_ACTIVE_TAB_INDEX,
    payload: index,
})

export const setPreview = preview => ({
    type: actionTypes.SET_PREVIEW,
    payload: preview,
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


const setSelectedSpeakerNumber = speakerNumber => ({
    type: actionTypes.SET_SELECTED_SPEAKER_NUMBER,
    payload: speakerNumber,
})

const setTmpViewedArticle = article => ({
    type: actionTypes.SET_TEMP_VIEWED_ARTICLE,
    payload: article,
})

const updateOriginalTranslatableArticle = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    const { originalTranslatableArticle } = getState()[moduleName];
    if (originalTranslatableArticle) {
        const slide = originalTranslatableArticle.slides.find(s => s.position === slidePosition);
        if (slide) {
            const subslide = slide.content.find(s => s.position === subslidePosition);
            if (subslide) {
                Object.keys(changes).forEach((key) => {
                    originalTranslatableArticle.slides.find(s => s.position === slidePosition).content.find(s => s.position === subslidePosition)[key] = changes[key];
                })
                dispatch(setOriginalTranslatableArticle(_.cloneDeep(originalTranslatableArticle)));
            }
        }
    }
}

export const onPreviewChange = preview => (dispatch, getState) => {
    dispatch(setPreview(preview));
    dispatch(setCurrentSlideIndex(0));
    dispatch(setCurrentSubslideIndex(0));

    const { translatableArticle, originalViewedArticle, tmpViewedArticle } = getState()[moduleName];
    if (preview) {
        dispatch(setTmpViewedArticle(originalViewedArticle));
        dispatch(setOriginalViewedArticle(_.cloneDeep(translatableArticle)));
        dispatch(setEditorMuted(false));
        dispatch(setEditorPlaying(true));
    } else {
        dispatch(setOriginalViewedArticle(_.cloneDeep(tmpViewedArticle)));
        dispatch(setTmpViewedArticle(null));
        dispatch(setEditorMuted(false));
        dispatch(setEditorPlaying(false));
    }
}

export const changeSelectedSpeakerNumber = speakerNumber => (dispatch, getState) => {
    
    const { originalTranslatableArticle, originalArticle } = getState()[moduleName];
    const translatableArticle = _.cloneDeep(originalTranslatableArticle);
    const originalViewedArticle = _.cloneDeep(originalArticle)
    if (speakerNumber !== -1) {
        translatableArticle.slides.forEach((slide) => {
            slide.content = slide.content.filter((subslide) => subslide.speakerProfile.speakerNumber === speakerNumber);
        })
        translatableArticle.slides = translatableArticle.slides.filter((s) => s.content.length !== 0);

        originalViewedArticle.slides.forEach((slide) => {
            slide.content = slide.content.filter((subslide) => subslide.speakerProfile.speakerNumber === speakerNumber);
        })
        originalViewedArticle.slides = originalViewedArticle.slides.filter((s) => s.content.length > 0);
    }
    dispatch(setCurrentSlideIndex(0));
    dispatch(setCurrentSubslideIndex(0));
    dispatch(setSelectedSpeakerNumber(speakerNumber));
    dispatch(setTranslatableArticle(translatableArticle));
    dispatch(setOriginalViewedArticle(originalViewedArticle))

}


export const fetchTranslatableArticle = (originalArticleId, lang) => dispatch => {
    dispatch(setOriginalArticle(null));
    dispatch(setTranslatableArticle(null));
    console.log('fetching translatable article ==========================================')
    requestAgent
    .get(`${Api.translate.getTranslatableArticle(originalArticleId)}?lang=${lang}`)
    .then((res) => {
        const { article, originalArticle } = res.body;
        console.log('response', res.body)
        dispatch(setOriginalArticle(_.cloneDeep(originalArticle)));
        dispatch(setOriginalViewedArticle(_.cloneDeep(originalArticle)));
        dispatch(setTranslatableArticle(_.cloneDeep(article)));
        dispatch(setOriginalTranslatableArticle(_.cloneDeep(article)));
        dispatch(changeSelectedSpeakerNumber(-1))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const updateSubslide = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName];
    const slide = translatableArticle.slides.find(s => s.position === slidePosition);
    if (slide) {
        const subslide = slide.content.find(s => s.position === subslidePosition)
        if (subslide) {
            Object.keys(changes).forEach((key) => {
                translatableArticle.slides.find(s => s.position === slidePosition).content.find(s => s.position === subslidePosition)[key] = changes[key]; 
            })
            dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
            dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { ...changes }));
        }

    }
}

export const saveTranslatedText = (slidePosition, subslidePosition, text) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    requestAgent
    .post(Api.translate.addTranslatedText(translatableArticle._id), { slidePosition, subslidePosition, text })
    .then((res) => {
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex].text = text;
        dispatch(setTranslatableArticle({ ...translatableArticle }));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { text }))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const saveRecordedTranslation = (slidePosition, subslidePosition, blob) => (dispatch, getState) => {
    dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState()[moduleName]
    const url = URL.createObjectURL(blob);

    const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
    const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
    const oldAudio = translatableArticle.slides[slideIndex].content[subslideIndex].audio;

    translatableArticle.slides[slideIndex].content[subslideIndex].audio = url;
    dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
    dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: url }))

    requestAgent.post(Api.translate.addRecordedTranslation(translatableArticle._id))
    .field('slidePosition', slidePosition)
    .field('subslidePosition', subslidePosition)
    .field('file', blob)
    .then((res) => {
        translatableArticle.slides[slideIndex].content[subslideIndex].audio = res.body.audio;
        dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: res.body.audio }))
        dispatch(setRecordUploadLoading(false));

        dispatch(setEditorPlaying(false));
        dispatch(setEditorMuted(false));

    })
    .catch((err) => {
        console.log(err);

        translatableArticle.slides[slideIndex].content[subslideIndex].audio = oldAudio;
        dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: oldAudio }))
        dispatch(setRecordUploadLoading(false));

        dispatch(setEditorPlaying(false));
        dispatch(setEditorMuted(false));
        NotificationService.responseError(err);
    })
}


export const deleteRecordedTranslation = (slidePosition, subslidePosition) => (dispatch, getState) => {
    dispatch(setRecordUploadLoading(true));
    const { translatableArticle } = getState()[moduleName]
    requestAgent.delete(Api.translate.deleteRecordedTranslation(translatableArticle._id), { slidePosition, subslidePosition })
    .then((res) => {
        const slideIndex = translatableArticle.slides.findIndex((s) => s.position === slidePosition);
        const subslideIndex = translatableArticle.slides[slideIndex].content.findIndex((s) => s.position === subslidePosition);
        translatableArticle.slides[slideIndex].content[subslideIndex].audio = res.body.audio || '';
        dispatch(setTranslatableArticle(_.cloneDeep(translatableArticle)));
        dispatch(updateOriginalTranslatableArticle(slidePosition, subslidePosition, { audio: '' }))
        dispatch(setRecordUploadLoading(false));

    })
    .catch((err) => {
        console.log(err);
        dispatch(setRecordUploadLoading(false));
        NotificationService.responseError(err);
    })
}



export const requestExportTranslationReview = (articleId) => (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName]
    requestAgent
    .post(Api.translationExport.requestExportTranslationReview(), { articleId: translatableArticle._id })
    .then((res) => {
        // NotificationService.success('The video has been queued to be exported. we\'ll notify you once it\'s done :)');
        NotificationService.success('The video has been queued to be exported.');
        dispatch(setActiveTabIndex(2));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
    })
}

export const approveTranslationExport = (translationExportId) => (dispatch, getState) => {
    dispatch(setLaoding(true))
    const { exportHistoryCurrentPageNumber } = getState()[moduleName];
    requestAgent
    .post(Api.translationExport.approveExportTranslation(translationExportId))
    .then((res) => {
        dispatch(fetchTranslationExports(exportHistoryCurrentPageNumber, true))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const declineTranslationExport = (translationExportId) => (dispatch, getState) => {
    dispatch(setLaoding(true));
    const { exportHistoryCurrentPageNumber } = getState()[moduleName];
    requestAgent
    .post(Api.translationExport.declineeExportTranslation(translationExportId))
    .then((res) => {
        dispatch(fetchTranslationExports(exportHistoryCurrentPageNumber, true));
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}

export const fetchTranslationExports = (pageNumber, loading) =>  (dispatch, getState) => {
    const { translatableArticle } = getState()[moduleName];
    if (loading) {
        dispatch(setTranslationExports([]));
        dispatch(setLaoding(true))
    }
    requestAgent
    .get(Api.translationExport.getByArticleId(translatableArticle._id, { page: pageNumber }))
    .then((res) => {
        const { translationExports, pagesCount } = res.body;
        dispatch(setExportHistoryTotalPages(pagesCount))
        dispatch(setTranslationExports(translationExports));
        dispatch(setLaoding(false))
    })
    .catch((err) => {
        console.log(err);
        NotificationService.responseError(err);
        dispatch(setLaoding(false))
    })
}