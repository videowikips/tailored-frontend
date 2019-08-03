import * as actionTypes from './types';

const INITIAL_STATE = {
    activeTabIndex: 0,
    videos: [],
    videosLoading: false,
    currentPageNumber: 0,
    totalPagesCount: 0,
    languageFilter: 'en-US',
    addHumanVoiceModalVisible: false,
    selectedVideo: null,
    translatedArticles: [],
}

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case actionTypes.SET_VIDEOS:
            return { ...state, videos: action.payload };
        case actionTypes.SET_VIDEO_LOADING:
            return { ...state, videosLoading: action.payload };
        case actionTypes.SET_ACTIVE_TAB_INDEX:
            return { ...state, activeTabIndex: action.payload };
        case actionTypes.SET_LANGUAGE_FILTER:
            return { ...state, languageFilter: action.payload };
        case actionTypes.SET_ADD_HUMAN_VOICE_MODAL_VISIBLE:
            return { ...state, addHumanVoiceModalVisible: action.payload };
        case actionTypes.SET_SELECTED_VIDEO:
            return { ...state, selectedVideo: action.payload };
        case actionTypes.SET_TRANSLATED_ARTICLES:
            return { ...state, translatedArticles: action.payload };
        case actionTypes.SET_CURRENT_PAGE_NUMBER:
            return { ...state, currentPageNumber: action.payload };
        case actionTypes.SET_TOTAL_PAGES_COUNT:
            return { ...state, totalPagesCount: action.payload };
        default:
            return state;
    }
}

