import * as actionTypes from './types';

const INITIAL_STATE = {
    loading: false,
    archivedTranslatedArticles: [],

    currentPageNumber: 0,
    totalPagesCount: 0,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ARCHIVED_TRANSLATED_ARTICLES:
            return { ...state, archivedTranslatedArticles: action.payload };
        case actionTypes.SET_TOTAL_PAGES_COUNT:
            return { ...state, totalPagesCount: action.payload };
        case actionTypes.SET_CURRENT_PAGE_NUMBER:
            return { ...state, currentPageNumber: action.payload };
        default:
            return state;
    }
}