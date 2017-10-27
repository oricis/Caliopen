import * as selectors from './index';

describe('component CallToAction', () => {
  it('init', () => {
    const state = {
      application: { applicationName: '' },
    };
    const props = { location: { pathname: '/' } };

    // expect(selectors.principalActionSelector(state, props).route).toEqual('/');
    expect(selectors.availableActionsSelector(state, props).length).toEqual(1);
    expect(selectors.availableActionsSelector(state, props)[0].route).toEqual('/');
  });
});
