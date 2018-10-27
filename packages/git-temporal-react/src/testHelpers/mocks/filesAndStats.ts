import { FilesContainerSorts } from 'app/actions/ActionTypes';

const filesAndStats = {
  isFileSelected: false,
  filesContainerSearch: '',
  filesContainerSort: FilesContainerSorts.TIME,
  files: [
    {
      fileName: 'docs/js/react.js',
      authorNames: [
        'Daniel Lo Nigro',
        'Dan Abramov',
        'Linus Unnebäck',
        'tomocchino',
        'Paul O’Shannessy',
        'Scott Feeney',
        'Ben Alpert',
        'Jim',
        'Marjan',
      ],
      commits: 27,
      linesAdded: 41962,
      linesDeleted: 41962,
      firstCommitOn: 1427579814,
      lastCommitOn: 1493211770,
    },
    {
      fileName: 'fixtures/attribute-behavior/public/react-dom.development.js',
      authorNames: ['Andrew Clark'],
      commits: 2,
      linesAdded: 22296,
      linesDeleted: 22296,
      firstCommitOn: 1503701077,
      lastCommitOn: 1503706651,
    },
    {
      fileName: 'fixtures/dom/public/react-dom.js',
      authorNames: ['Brandon Dail', 'Nathan Hunzaker'],
      commits: 2,
      linesAdded: 18938,
      linesDeleted: 18938,
      firstCommitOn: 1482155031,
      lastCommitOn: 1483741679,
    },
    {
      fileName: 'docs/js/react-dom.js',
      authorNames: [
        'Daniel Lo Nigro',
        'tomocchino',
        'Paul O’Shannessy',
        'Scott Feeney',
        'Nate Lee',
        'Ben Alpert',
        'Jim',
      ],
      commits: 22,
      linesAdded: 18265,
      linesDeleted: 18265,
      firstCommitOn: 1444082554,
      lastCommitOn: 1493211770,
    },
    {
      fileName: 'docs/js/JSXTransformer.js',
      authorNames: ['Vipul A M', 'Paul O’Shannessy', 'Ben Alpert'],
      commits: 4,
      linesAdded: 15939,
      linesDeleted: 15939,
      firstCommitOn: 1427579814,
      lastCommitOn: 1434369377,
    },
  ],
};

export default filesAndStats;
