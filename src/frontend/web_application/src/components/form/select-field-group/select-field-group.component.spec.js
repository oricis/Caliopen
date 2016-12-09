import formModule from '../index.js';

describe('component selectFieldGroup', () => {
  let $componentController;

  beforeEach(() => {
    angular.mock.module(formModule);
  });

  beforeEach(angular.mock.inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));


  it('init', () => {
    const bindings = {
      props: {},
      label: 'Foo',
      model: 'D.',
      options: ['a', 'b', 'c'],
      onChange: jasmine.createSpy('onChange'),
    };

    const ctrl = $componentController('textFieldGroup', null, bindings);

    expect(ctrl).toBeDefined();
  });
});
