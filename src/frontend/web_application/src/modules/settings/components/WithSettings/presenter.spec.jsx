import React from 'react';
import { Trans } from 'lingui-react';
import { shallow } from 'enzyme';
import WithSettings from './presenter';

describe('component WithSettings', () => {
  it('render', () => {
    const ownProps = {
      requestSettings: jest.fn(),
    };
    const comp = shallow(
      <WithSettings
        {...ownProps}
        render={(settings) => {
          if (settings) {
            return 'set';
          }

          return 'not set';
        }}
      />
    );

    expect(comp.text()).toEqual('not set');
    expect(ownProps.requestSettings).toHaveBeenCalled();
  });

  it('does not refetch', () => {
    const ownProps = {
      requestSettings: jest.fn(),
      settings: {},
    };
    const comp = shallow(
      <WithSettings
        {...ownProps}
        render={(settings) => {
          if (settings) {
            return 'set';
          }

          return 'not set';
        }}
      />
    );

    expect(comp.text()).toEqual('set');
    expect(ownProps.requestSettings).not.toHaveBeenCalled();
  });

  it('forces refetch', () => {
    const ownProps = {
      requestSettings: jest.fn(),
      settings: {},
      isInvalidated: true,
    };
    const comp = shallow(
      <WithSettings
        {...ownProps}
        render={(settings) => {
          if (settings) {
            return 'set';
          }

          return 'not set';
        }}
      />
    );

    expect(comp.text()).toEqual('set');
    expect(ownProps.requestSettings).toHaveBeenCalled();
  });
});
