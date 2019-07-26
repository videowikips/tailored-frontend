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
    .post(Api.translate.saveTranslatedText(translatableArticle._id), { slidePosition, subslidePosition, text })
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