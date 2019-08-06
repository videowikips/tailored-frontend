import * as actionTypes from './types';

const INITIAL_STATE = {
    translatableArticle: null,
    originalTranslatableArticle: null,
    
    originalArticle: null,
    originalViewedArticle: null,

    tmpViewedArticle: null,

    currentSlideIndex: 0,
    currentSubslideIndex: 0,

    recording: false,
    recordUploadLoading: false,

    editorPlaying: false,
    editorMuted: false,

    preview: false,

    selectedSpeakerNumber: null,

    translationExports: [],
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_ORIGINAL_ARTICLE:
            return { ...state, originalArticle: action.payload };
        case actionTypes.SET_ORIGINAL_VIEWED_ARTICLE:
            return { ...state, originalViewedArticle: action.payload };
        case actionTypes.SET_ORIGINAL_TRANSLATABLE_ARTICLE:
            return { ...state, originalTranslatableArticle: action.payload };
        case actionTypes.SET_TRANSLATABLE_ARTICLE:
            return { ...state, translatableArticle: action.payload };
        case actionTypes.SET_TEMP_VIEWED_ARTICLE:
            return { ...state, tmpViewedArticle: action.payload };
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
        case actionTypes.SET_PREVIEW:
            return { ...state, preview: action.payload };
        case actionTypes.SET_SELECTED_SPEAKER_NUMBER:
            return { ...state, selectedSpeakerNumber: action.payload };
        case actionTypes.SET_TRANSLATION_EXPORTS:
            return { ...state, translationExports: action.payload };
        default:
            return state;
    }
}