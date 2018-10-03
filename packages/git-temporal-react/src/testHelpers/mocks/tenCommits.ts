// these are the first ten commits taken from the react.js test repo used by git-temporal/git-log-scraper
// see, https://raw.githubusercontent.com/git-temporal/git-temporal/master/packages/git-log-scraper/test/snapshots/react.snapshot.json

const tenCommits = [
  {
    id: 'abbf59e3af03cc872a52a8bb3a1dcfeb1b60d9bb',
    authorName: 'Bee Wilkerson',
    relativeDate: '2 days ago',
    authorDate: 1537542150,
    message: 'Explain why this fork exists in README.md',
    body: '',
    hash: 'abbf59e3a',
    linesAdded: 2,
    linesDeleted: 74,
    files: [
      {
        name: 'README.md',
        linesAdded: 2,
        linesDeleted: 74,
      },
    ],
  },
  {
    id: 'e1a067dea0ffcacd1f664f30cd14463b00f52fa7',
    authorName: 'Maksim Markelov',
    relativeDate: '4 days ago',
    authorDate: 1537379312,
    message: 'Fix circular dependency in TracingSubscriptions (#13689)',
    body: '',
    hash: 'e1a067dea',
    linesAdded: 1,
    linesDeleted: 1,
    files: [
      {
        name: 'packages/scheduler/src/TracingSubscriptions.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
    ],
  },
  {
    id: '518812eeb82a524dd264be79ca0573ce39cde945',
    authorName: 'Heaven',
    relativeDate: '4 days ago',
    authorDate: 1537359272,
    message: 'Clarify comment (#13684)',
    body: '* fix comment typo <br> <br>* Update Scheduler.js <br>',
    hash: '518812eeb',
    linesAdded: 1,
    linesDeleted: 1,
    files: [
      {
        name: 'packages/scheduler/src/Scheduler.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
    ],
  },
  {
    id: 'eeb817785c771362416fd87ea7d2a1a32dde9842',
    authorName: 'Dan',
    relativeDate: '5 days ago',
    authorDate: 1537317391,
    message: 'Remove some old files from stats',
    body: '',
    hash: 'eeb817785',
    linesAdded: 0,
    linesDeleted: 42,
    files: [
      {
        name: 'scripts/rollup/results.json',
        linesAdded: 0,
        linesDeleted: 42,
      },
    ],
  },
  {
    id: '7ea3ca1d13b1b609678fa1369f8a1020c3ecb976',
    authorName: 'Dan Abramov',
    relativeDate: '5 days ago',
    authorDate: 1537316788,
    message: 'Rename schedule to scheduler (#13683)',
    body: '',
    hash: '7ea3ca1d1',
    linesAdded: 213,
    linesDeleted: 209,
    files: [
      {
        name: 'fixtures/{schedule => scheduler}/index.html',
        linesAdded: 5,
        linesDeleted: 4,
      },
      {
        name: 'fixtures/tracing/index.html',
        linesAdded: 2,
        linesDeleted: 2,
      },
      {
        name: 'fixtures/tracing/script.js',
        linesAdded: 26,
        linesDeleted: 26,
      },
      {
        name: 'fixtures/unstable-async/suspense/src/components/App.js',
        linesAdded: 5,
        linesDeleted: 2,
      },
      {
        name: 'fixtures/unstable-async/suspense/src/index.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'fixtures/unstable-async/time-slicing/README.md',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'fixtures/unstable-async/time-slicing/src/index.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-art/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-art/src/ReactARTHostConfig.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-dom/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-dom/src/client/ReactDOMHostConfig.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-native-renderer/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-reconciler/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-reconciler/src/ReactFiberRoot.js',
        linesAdded: 2,
        linesDeleted: 2,
      },
      {
        name: 'packages/react-reconciler/src/ReactFiberScheduler.js',
        linesAdded: 2,
        linesDeleted: 2,
      },
      {
        name:
          'packages/react-reconciler/src/__tests__/ReactTracing-test.internal.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react-test-renderer/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react/package.json',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/react/src/ReactSharedInternals.js',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name: 'packages/react/src/__tests__/ReactProfiler-test.internal.js',
        linesAdded: 5,
        linesDeleted: 5,
      },
      {
        name:
          'packages/react/src/__tests__/ReactProfilerDevToolsIntegration-test.internal.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/schedule/npm/index.js',
        linesAdded: 0,
        linesDeleted: 7,
      },
      {
        name: 'packages/schedule/npm/tracing-profiling.js',
        linesAdded: 0,
        linesDeleted: 7,
      },
      {
        name: 'packages/schedule/npm/tracing.js',
        linesAdded: 0,
        linesDeleted: 7,
      },
      {
        name: 'packages/{schedule => scheduler}/README.md',
        linesAdded: 2,
        linesDeleted: 2,
      },
      {
        name: 'packages/{schedule => scheduler}/index.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/scheduler/npm/index.js',
        linesAdded: 7,
        linesDeleted: 0,
      },
      {
        name: 'packages/scheduler/npm/tracing-profiling.js',
        linesAdded: 7,
        linesDeleted: 0,
      },
      {
        name: 'packages/scheduler/npm/tracing.js',
        linesAdded: 7,
        linesDeleted: 0,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule-tracing.profiling.min.js => scheduler/npm/umd/scheduler-tracing.development.js}',
        linesAdded: 8,
        linesDeleted: 8,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule-tracing.production.min.js => scheduler/npm/umd/scheduler-tracing.production.min.js}',
        linesAdded: 8,
        linesDeleted: 8,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule-tracing.development.js => scheduler/npm/umd/scheduler-tracing.profiling.min.js}',
        linesAdded: 8,
        linesDeleted: 8,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule.production.min.js => scheduler/npm/umd/scheduler.development.js}',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule.profiling.min.js => scheduler/npm/umd/scheduler.production.min.js}',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name:
          'packages/{schedule/npm/umd/schedule.development.js => scheduler/npm/umd/scheduler.profiling.min.js}',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name: 'packages/{schedule => scheduler}/package.json',
        linesAdded: 2,
        linesDeleted: 2,
      },
      {
        name:
          'packages/{schedule/src/Schedule.js => scheduler/src/Scheduler.js}',
        linesAdded: 0,
        linesDeleted: 0,
      },
      {
        name: 'packages/{schedule => scheduler}/src/Tracing.js',
        linesAdded: 0,
        linesDeleted: 0,
      },
      {
        name: 'packages/{schedule => scheduler}/src/TracingSubscriptions.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name:
          'packages/{schedule/src/__tests__/Schedule-test.internal.js => scheduler/src/__tests__/Scheduler-test.internal.js}',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name:
          'packages/{schedule/src/__tests__/ScheduleDOM-test.js => scheduler/src/__tests__/SchedulerDOM-test.js}',
        linesAdded: 19,
        linesDeleted: 19,
      },
      {
        name:
          'packages/{schedule/src/__tests__/ScheduleUMDBundle-test.internal.js => scheduler/src/__tests__/SchedulerUMDBundle-test.internal.js}',
        linesAdded: 8,
        linesDeleted: 8,
      },
      {
        name:
          'packages/{schedule => scheduler}/src/__tests__/Tracing-test.internal.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/{schedule => scheduler}/src/__tests__/Tracing-test.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name:
          'packages/{schedule => scheduler}/src/__tests__/TracingSubscriptions-test.internal.js',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'packages/{schedule => scheduler}/tracing.js',
        linesAdded: 0,
        linesDeleted: 0,
      },
      {
        name: 'packages/shared/forks/{Schedule.umd.js => Scheduler.umd.js}',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name:
          'packages/shared/forks/{ScheduleTracing.umd.js => SchedulerTracing.umd.js}',
        linesAdded: 1,
        linesDeleted: 1,
      },
      {
        name: 'scripts/rollup/bundles.js',
        linesAdded: 6,
        linesDeleted: 6,
      },
      {
        name: 'scripts/rollup/forks.js',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name: 'scripts/rollup/modules.js',
        linesAdded: 4,
        linesDeleted: 4,
      },
      {
        name: 'scripts/rollup/results.json',
        linesAdded: 36,
        linesDeleted: 36,
      },
    ],
  },
  {
    id: '9b70816642c68672da97e911d6d351fd3c596474',
    authorName: 'Brian Vaughn',
    relativeDate: '5 days ago',
    authorDate: 1537299931,
    message: 'Added another bullet to the CHANGELOG',
    body: '',
    hash: '9b7081664',
    linesAdded: 2,
    linesDeleted: 1,
    files: [
      {
        name: 'CHANGELOG.md',
        linesAdded: 2,
        linesDeleted: 1,
      },
    ],
  },
  {
    id: 'db9d51b65caeec0cfd2b8e35df59bdaba3eaa31b',
    authorName: 'Brian Vaughn',
    relativeDate: '5 days ago',
    authorDate: 1537299674,
    message: "Rename 'Schedule' header -> 'Schedule (Experimental)'",
    body: '',
    hash: 'db9d51b65',
    linesAdded: 1,
    linesDeleted: 1,
    files: [
      {
        name: 'CHANGELOG.md',
        linesAdded: 1,
        linesDeleted: 1,
      },
    ],
  },
  {
    id: '0823f845cf38141866e7e5164c80d75b4985df04',
    authorName: 'Brian Vaughn',
    relativeDate: '5 days ago',
    authorDate: 1537299572,
    message: '16.5.2 CHANGELOG',
    body: '',
    hash: '0823f845c',
    linesAdded: 12,
    linesDeleted: 0,
    files: [
      {
        name: 'CHANGELOG.md',
        linesAdded: 12,
        linesDeleted: 0,
      },
    ],
  },
  {
    id: 'bec2ddaf157497ddca85e823e180536d8154a52f',
    authorName: 'Brian Vaughn',
    relativeDate: '5 days ago',
    authorDate: 1537295450,
    message: 'Update bundle sizes for 16.5.2 release',
    body: '',
    hash: 'bec2ddaf1',
    linesAdded: 125,
    linesDeleted: 69,
    files: [
      {
        name: 'scripts/rollup/results.json',
        linesAdded: 125,
        linesDeleted: 69,
      },
    ],
  },
  {
    id: '789e714bd738b0dd566f3cff33932b9586751fc5',
    authorName: 'Brian Vaughn',
    relativeDate: '5 days ago',
    authorDate: 1537295450,
    message: 'Update error codes for 16.5.2 release',
    body: '',
    hash: '789e714bd',
    linesAdded: 2,
    linesDeleted: 1,
    files: [
      {
        name: 'scripts/error-codes/codes.json',
        linesAdded: 2,
        linesDeleted: 1,
      },
    ],
  },
];

export default tenCommits;
