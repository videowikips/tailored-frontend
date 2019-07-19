const API_ROOT = 'http://localhost:4000/api';

export default {
    video: {
        uploadVideo: `${API_ROOT}/video/upload`,
        getVideoById: (id) => `${API_ROOT}/video/${id}`,
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