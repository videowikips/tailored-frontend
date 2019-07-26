import * as actionTypes from '../actions/translation/types';

const INITIAL_STATE = {
    translatableArticle: null,
    originalArticle: null,
    currentSlideIndex: 0,
    currentSubslideIndex: 0,
    recording: false,
    recordUploadLoading: false,
    editorPlaying: false,
    editorMuted: false,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_ORIGINAL_ARTICLE:
            return { ...state, originalArticle: action.payload };
        case actionTypes.SET_TRANSLATABLE_ARTICLE:
            return { ...state, translatableArticle: action.payload };
        case actionTypes.SET_CURRENT_SLIDE_INDEX:
            return { ...state, currentSlideIndex: action.payload };
        case actionTypes.SET_CURRENT_SUBSLIDE_INDEX:
            return { ...state, currentSubslideIndex: action.payload };
        case actionTypes.SET_CURRENT_EDITOR_INDEXES:
            return { ...state, currentSlideIndex: action.payload.currentSlideIndex, currentSubslideIndex: action.payload.currentSubslideIndex }
        case actionTypes.SET_TRANSLATION_RECORDING:
            return { ...state, recording: action.payload };
        case actionTypes.SET_RECORD_UPLOAD_LOADING:
            return { ...state, recordUploadLoading: action.payload };
        case actionTypes.SET_EDITOR_MUTED:
            return { ...state, editorMuted: action.payload };
        case actionTypes.SET_EDITOR_PLAYING:
            return { ...state, editorPlaying: action.payload };
        default:
            return state;
    }
}