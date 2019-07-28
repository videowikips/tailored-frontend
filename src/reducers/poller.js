import * as actionTypes from '../actions/poller/types';

const INITIAL_STATE = {
    jobs: {},
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.START_JOB:
            return { ...state, jobs: { ...state.jobs, [action.payload.jobName]: { id: action.payload.id } } };
        case actionTypes.STOP_JOB:
            const jobs = { ...state.jobs };
            delete jobs[action.payload.jobName];

            return { ...state, jobs };
        default:
            return state;
    }
}