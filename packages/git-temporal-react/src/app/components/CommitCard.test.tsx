import React from 'react';
import { shallow } from 'enzyme';

import { CommitCard } from './CommitCard';

const testProps = {
  commit: {
    id: '408e8ce22ce7436e88a9977b4dc99fc3c431fc67',
    authorName: 'Michaël Zasso',
    relativeDate: '3 days ago',
    authorDate: 1537212012,
    message: 'doc: update maintaining V8 guide',
    body:
      'Replace references to the outdated `update-v8` tool to its replacementin `node-core-utils`PR-URL: https://github.com/nodejs/node/pull/22913Reviewed-By: Richard Lau <riclau@uk.ibm.com>Reviewed-By: Colin Ihrig <cjihrig@gmail.com>Reviewed-By: Weijia Wang <starkwang@126.com>Reviewed-By: Sakthipriyan Vairamani <thechargingvolcano@gmail.com>Reviewed-By: Joyee Cheung <joyeec9h3@gmail.com>Reviewed-By: Luigi Pinca <luigipinca@gmail.com>Reviewed-By: James M Snell <jasnell@gmail.com>',
    hash: '408e8ce22c',
    linesAdded: 8,
    linesDeleted: 8,
    files: [
      {
        name: 'doc/guides/maintaining-V8.md',
        linesAdded: 8,
        linesDeleted: 8,
      },
    ],
  },
};

describe('components/CommitCard', () => {
  describe('when rendered with required props', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommitCard {...testProps} />);
    });

    test('it should match snapshot (bars should be at 50%)', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
