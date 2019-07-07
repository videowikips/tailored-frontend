const API_ROOT = 'http://localhost:4000/api';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
    },
    article: {
        getbyVideoId: id => `${API_ROOT}/article/by_video_id?videoId=${id}`
    }
}