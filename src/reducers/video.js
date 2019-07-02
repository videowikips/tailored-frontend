import * as actionTypes from '../actions/video/types';

const INITIAL_STATE = {
    uploadProgress: 0,
    uploadState: 'done',
}

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.UPLOAD_VIDEO_PROGRESS:
            return { ...state, uploadProgress: action.payload };
        case actionTypes.UPLOAD_VIDEO_LOADING:
            return { ...state, uploadState: 'loading', uploadProgress: 0 };
        case actionTypes.UPLOAD_VIDEO_SUCCESS:
            return { ...state, uploadState: 'done', uploadProgress: 0, };
        case actionTypes.UPLOAD_VIDEO_FAILED:
            return { ...state, uploadState: 'failed', uploadProgress: 0 };
        default:
            return state;
    }
}