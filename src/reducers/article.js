import * as actionTypes from '../actions/article/types';

const INITIAL_STATE = {
    article: null,
    fetchArticleState: 'done',
    fetchArticleError: '',
    updateSubslideState: 'done',
    subtitles: [],
    selectedSubtitle: {
        subtitle: null,
        subtitleIndex: null,
    }
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLE_LOADING:
            return { ...state, fetchArticleState: 'loading', fetchArticleError: '', article: null };
        case actionTypes.FETCH_ARTICLE_FAILED:
            return { ...state, fetchArticleState: 'failed', fetchArticleError: action.payload };
        case actionTypes.FETCH_ARTICLE_SUCCESS:
            return { ...state, fetchArticleState: 'done', article: action.payload };
        case actionTypes.UPDATE_SUBSLIDE_LOADING:
            return { ...state, updateSubslideState: 'loading' };
        case actionTypes.UPDATE_SUBSLIDE_FAILED:
            return { ...state, updateSubslideState: 'failed' };
        case actionTypes.UPDATE_SUBSLIDE_SUCCESS:
            return { ...state, updateSubslideState: 'done', article: action.payload };
        case actionTypes.SET_SUBTITLES:
            return { ...state, subtitles: action.payload };
        case actionTypes.SET_ARTICLE:
            return { ...state, article: action.payload };
        case actionTypes.SET_SELECTED_SUBTITLE:
            return { ...state, selectedSubtitle: action.payload };
        default:
            return state;
    }
}