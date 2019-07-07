import * as actionTypes from '../actions/article/types';

const INITIAL_STATE = {
    article: null,
    fetchArticleState: 'done',
    fetchArticleError: '',
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.FETCH_ARTICLE_LOADING:
            return { ...state, fetchArticleState: 'loading', fetchArticleError: '', article: null };
        case actionTypes.FETCH_ARTICLE_FAILED:
            return { ...state, fetchArticleState: 'failed', fetchArticleError: action.payload };
        case actionTypes.FETCH_ARTICLE_SUCCESS:
            return { ...state, fetchArticleState: 'done', article: action.payload };
        default:
            return state;
    }
}