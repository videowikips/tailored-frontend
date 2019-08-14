import * as actionTypes from './types';
import Api from '../../../../shared/api';
import requestAgent from '../../../../shared/utils/requestAgent';
import NotificationService from '../../../../shared/utils/NotificationService';

const setLoading = loading => ({
    type: actionTypes.SET_LOADING,
    payload: loading, 
})

const setArchivedTranslatedArticles = articles => ({
    type: actionTypes.SET_ARCHIVED_TRANSLATED_ARTICLES,
    payload: articles,
})

const setTotalPagesCount = count => ({
    type: actionTypes.SET_TOTAL_PAGES_COUNT,
    payload: count,
})

export const setCurrentPageNumber = pageNumber => ({
    type: actionTypes.SET_CURRENT_PAGE_NUMBER,
    payload: pageNumber,
})

export const fetchArchivedTranslatedArticles = (organization, page) => (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(setArchivedTranslatedArticles([]))
    requestAgent
        .get(Api.article.getTranslatedArticles({ organization, page, archived: true }))
        .then((res) => {
            const { videos, pagesCount } = res.body;
            dispatch(setArchivedTranslatedArticles(videos));
            dispatch(setLoading(false))
            if (pagesCount) {
                dispatch(setTotalPagesCount(pagesCount));
            }
        })
        .catch((err) => {
            NotificationService.responseError(err);
            dispatch(setLoading(false))
        })
}