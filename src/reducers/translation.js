import * as actionTypes from '../actions/translation/types';

const INITIAL_STATE = {
    translatableArticle: null,
    originalArticle: null,
    currentSlideIndex: 0,
    currentSubslideIndex: 0,
    recording: false,
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
        default:
            return state;
    }
}