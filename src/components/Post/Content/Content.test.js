import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';
import Content from './Content';

jest.mock('moment', () => {
  const mockedMoment = {
    format: jest.fn(),
  };
  return jest.fn(() => mockedMoment);
});

describe('Content', () => {
  it('renders correctly', () => {
    moment().format.mockReturnValueOnce('December 26, 2019');

    const props = {
      title: 'test',
      body: '<p>test</p>'
    };

    const tree = renderer.create(<Content {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
