import React from 'react';
import { shallow } from 'enzyme';

import { CommitCardFiles } from './CommitCardFiles';

const testFiles = [
  {
    name: 'doc/api/crypto.md',
    linesAdded: 1,
    linesDeleted: 1,
  },
  {
    name: 'src/node_crypto.cc',
    linesAdded: 2,
    linesDeleted: 5,
  },
  {
    name: 'test/parallel/test-crypto-authenticated.js',
    linesAdded: 26,
    linesDeleted: 0,
  },
];

describe('components/CommitCardFiles', () => {
  describe('when rendered with files and expanded=false', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <CommitCardFiles files={testFiles} isExpanded={false} />
      );
    });

    test('it should match snapshot (it should have rendered "3 files changed")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered with files and expanded=true', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(
        <CommitCardFiles files={testFiles} isExpanded={true} />
      );
    });

    test('it should match snapshot (it should have rendered 3 files with added and deleted)")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('when rendered without files', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = shallow(<CommitCardFiles files={[]} isExpanded={true} />);
    });

    test('it should match snapshot (it should have rendered a placeholder message)")', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
