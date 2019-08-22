import * as actionTypes from './types';

const initialState = {
    loading: false,
    passwordLoading: false,
    showPasswordForm: false,
    user: null,
    oldPassword: '',
    password: '',
    passwordConfirm: '',
}

export default function(state = initialState, action) {
    switch(action.type) {
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_OLD_PASSWORD:
            return { ...state, oldPassword: action.payload };
        case actionTypes.SET_PASSWORD:
            return { ...state, password: action.payload };
        case actionTypes.SET_PASSWORD_CONFIRM:
            return { ...state, passwordConfirm: action.payload };
        case actionTypes.SET_SHOW_PASSWORD_FORM:
            return { ...state, showPasswordForm: action.payload };
        case actionTypes.SET_PASSWORD_LOADING:
            return { ...state, passwordLoading: action.payload };
        case actionTypes.SET_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
}