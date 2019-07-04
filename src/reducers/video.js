import * as actionTypes from '../actions/video/types';

const INITIAL_STATE = {
    video: null,
    fetchVideoState: 'done',
    fetchVideoError: '',

    uploadProgress: 0,
    uploadState: 'done',
    uploadError: '',
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.UPLOAD_VIDEO_PROGRESS:
            return { ...state, uploadProgress: action.payload };
        case actionTypes.UPLOAD_VIDEO_LOADING:
            return { ...state, uploadState: 'loading', uploadProgress: 0, uploadError: '', video: null, };
        case actionTypes.UPLOAD_VIDEO_SUCCESS:
            return { ...state, uploadState: 'done', video: action.payload, uploadProgress: 0, uploadError: ''};
        case actionTypes.UPLOAD_VIDEO_FAILED:
            return { ...state, uploadState: 'failed', uploadProgress: 0, uploadError: action.payload };
        case actionTypes.FETCH_VIDEO_LOADING:
            return { ...state, fetchVideoState: 'loading', video: null };
        case actionTypes.FETCH_VIDEO_SUCCESS:
            return { ...state, fetchVideoState: 'done', video: action.payload };
        case actionTypes.FETCH_VIDEO_FAILED:
            return { ...state, fetchVideoState: 'failed', fetchVideoError: action.payload };
        default:
            return state;
    }
}