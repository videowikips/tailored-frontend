import querystring from 'querystring';
const API_ROOT = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'https://videowiki.org/api';
export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
        convertVideo: (id) => `${API_ROOT}/video/${id}/convert`,
        getVideos: (params = {}) => `${API_ROOT}/video?${querystring.encode(params)}`,
        getOrganizationVideos: (id) => `${API_ROOT}/video?organization=${id}`,
        reviewVideo: id => `${API_ROOT}/video/${id}/review`,
    },
    article: {
        getById: id => `${API_ROOT}/article/${id}`,
        getbyVideoId: id => `${API_ROOT}/article/by_video_id?videoId=${id}`,
        updateSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        splitSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}/split`,
        addSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        deleteSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        updateSpeakers: (articleId) => `${API_ROOT}/article/${articleId}/speakersProfile`,
        getTranslatedArticles: (params) => `${API_ROOT}/article/translations?${querystring.encode(params)}`,

    },
    translate: {
        getTranslatableArticle: (originalArticleId) => `${API_ROOT}/translate/${originalArticleId}`,
        addTranslatedText: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/text`,
        addRecordedTranslation: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio`,
        deleteRecordedTranslation: (translateableArticleId) => `${API_ROOT}/translate/${translateableArticleId}/audio`,
    },
    translationExport: {
        getByArticleId: (articleId, params) => `${API_ROOT}/translationExport/by_article_id/${articleId}?${querystring.encode(params)}`,
        requestExportTranslationReview: () => `${API_ROOT}/translationExport/requestExport`,
        approveExportTranslation: (id) => `${API_ROOT}/translationExport/${id}/approve`,
        declineeExportTranslation: (id) => `${API_ROOT}/translationExport/${id}/decline`,
    },
    authentication: {
        login: `${API_ROOT}/auth/login`,
        register: `${API_ROOT}/auth/register`
    },
    organization: {
        getUsers: (params) => `${API_ROOT}/user/getOrgUsers?${querystring.encode(params)}`,
        inviteUser: (organizationId) => `${API_ROOT}/organization/${organizationId}/users`,
        removeUser: (organizationId, userId) =>  `${API_ROOT}/organization/${organizationId}/users/${userId}`,
        editPermissions: (organizationId, userId) => `${API_ROOT}/organization/${organizationId}/users/${userId}/permissions`,
        respondToInvitation: (organizationId) => `${API_ROOT}/organization/${organizationId}/invitations/respond`,
    },
    user: {
        isValidToken: `${API_ROOT}/user/isValidToken`,
        getUserDetails: `${API_ROOT}/user/getUserDetails`,
        updatePassword: (userId) => `${API_ROOT}/user/${userId}/password`,
    }
}