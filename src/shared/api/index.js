const API_ROOT = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'http://52.30.216.243:4000/api';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
        convertVideo: (id) => `${API_ROOT}/video/${id}/convert`,
        getOrganizationVideos: id => `${API_ROOT}/video?organization=${id}`
    },
    article: {
        getById: id => `${API_ROOT}/article/${id}`,
        getbyVideoId: id => `${API_ROOT}/article/by_video_id?videoId=${id}`,
        updateSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        splitSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}/split`,
        addSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        deleteSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        updateSpeakers: (articleId) => `${API_ROOT}/article/${articleId}/speakersProfile`,
    },
    authentication: {
        login: `${API_ROOT}/auth/login`,
        register: `${API_ROOT}/auth/register`
    },
    organization: {
        getUsers: `${API_ROOT}/user/getOrgUsers`,
        inviteUser: `${API_ROOT}/user/add`,
        removeUser: `${API_ROOT}/user/remove`,
        editPermissions: `${API_ROOT}/user/editPermissions`,
    },
    user: {
        isValidToken: `${API_ROOT}/user/isValidToken`,
        getUserDetails: `${API_ROOT}/user/getUserDetails`,
    }
}