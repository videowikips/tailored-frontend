const API_ROOT = 'http://localhost:4000/api';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
    },
    authentication: {
        login: `${API_ROOT}/auth/login`
    }
}