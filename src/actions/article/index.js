import * as actionTypes from './types';
import Api from '../../shared/api';
import requestAgent from '../../shared/utils/requestAgent';

const fetchArticleLoading = () => ({
    type: actionTypes.FETCH_ARTICLE_LOADING,
})

const fetchArticleSuccess = article => ({
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    payload: article,
})

const fetchArticleFailed = (err) => ({
    type: actionTypes.FETCH_ARTICLE_FAILED,
    payload: err,
})


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
        dispatch(fetchArticleFailed(reason));
    })
}