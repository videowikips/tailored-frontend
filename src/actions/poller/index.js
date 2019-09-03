import * as actionTypes from './types';

export const startJob = ({ jobName, interval, immediate }, callFunc) => (dispatch, getState) => {
    const { jobs } = getState().poller;
    if (jobs[jobName]) {
        throw new Error(`${jobName} is already registered`);
    }
    if (immediate) {
        callFunc();
    }
    const intervalId = setInterval(() => {
        callFunc()
    }, interval);
    dispatch({ type: actionTypes.START_JOB, payload: { jobName, id: intervalId } });
}

export const stopJob = jobName => (dispatch, getState) => {
    const { jobs } = getState().poller;
    if (jobs[jobName]) {
        clearInterval(jobs[jobName].id);
        dispatch({ type: actionTypes.STOP_JOB, payload: { id: jobs[jobName].id, jobName } });
    }

}