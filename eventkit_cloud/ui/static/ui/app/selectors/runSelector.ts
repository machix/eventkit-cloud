import { createSelector } from 'reselect';

export const getAllRuns = state => state.exports.data.runs;

export const getPropsRun = (state, props) => state.exports.data.runs[props.runId];

export const getDatacartIds = state => state.datacartDetails.ids;

export const getAllJobs = state => state.exports.data.jobs;

export const getAllProviderTasks = state => state.exports.data.provider_tasks;

export const getAllExportTasks = state => state.exports.data.tasks;

export const getPropsProviderTasks = () => createSelector(
    [getPropsRun, getAllProviderTasks, getAllExportTasks],
    (run, providerTasks, exportTasks) => run ? run.provider_tasks.map(id => toFullProviderTask(providerTasks[id], exportTasks)) : null,
);

export const getPropsJob = createSelector(
    [getPropsRun, getAllJobs],
    (run, jobs) => run ? jobs[run.job] : null,
);

export const toFullProviderTask = (providerTask, exportTasks) => {
    const tasks = providerTask.tasks.map(id => exportTasks[id]);
    return {
        ...providerTask,
        tasks,
    };
};

export const toFullRun = (run, jobs, providerTasks, exportTasks) => {
    if (!run.provider_tasks) {
        return run;
    }

    const runJob = jobs[run.job];
    const runTasks = run.provider_tasks.map(id => toFullProviderTask(providerTasks[id], exportTasks));
    return {
        ...run,
        job: runJob,
        provider_tasks: runTasks,
    };
};

export const makeFullRunSelector = () => createSelector(
    [getPropsRun, getPropsJob, getPropsProviderTasks()],
    (run, job, providerTasks) => run ? ({
        ...run,
        job,
        provider_tasks: providerTasks,
    }) : null,
);

export const makeAllRunsSelector = () => createSelector(
    [getAllRuns, getAllJobs, getAllProviderTasks, getAllExportTasks],
    (runs, jobs, providerTasks, exportTasks) => {
        return Object.values(runs).map(run => toFullRun(run, jobs, providerTasks, exportTasks));
    }
);

export const getDatacarts = createSelector(
    [getDatacartIds, getAllRuns],
    (ids, runs) => ids.map(id => runs[id]).filter(run => run !== undefined),
);

export const makeDatacartSelector = () => createSelector(
    [getDatacarts, getAllJobs, getAllProviderTasks, getAllExportTasks],
    (runs, jobs, providerTasks, exportTasks) => {
        return runs.map(run => toFullRun(run, jobs, providerTasks, exportTasks));
    }
);
