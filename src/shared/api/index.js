const API_ROOT = process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'http://52.30.216.243:4000/api';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
        convertVideo: (id) => `${API_ROOT}/video/${id}/convert`,
    },
    article: {
        getById: id => `${API_ROOT}/article/${id}`,
        getbyVideoId: id => `${API_ROOT}/article/by_video_id?videoId=${id}`,
        updateSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        splitSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}/split`,
        addSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        deleteSubslide: (articleId, slideIndex, subslideIndex) => `${API_ROOT}/article/${articleId}/slides/${slideIndex}/content/${subslideIndex}`,
        updateSpeakers: (articleId) => `${API_ROOT}/article/${articleId}/speakersProfile`,
    }
}