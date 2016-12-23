import { stateGo } from 'redux-ui-router';
const moduleName = 'caliopenApp';

describe('component Contact Add Im Form', () => {
  const contact = {
    contact_id: 'foo',
    ims: [],
  };
  const successfulContactDetail = {
    street: 'foobar',
  };
  const failContactDetail = {
    type: 'unknown',
  };

  let $componentController;

  beforeEach(() => {
    // TODO: dependency on root app component to remove
    angular.mock.module(moduleName, ($provide, $translateProvider) => {
      $translateProvider.translations('en', {});
      $translateProvider.preferredLanguage('en');
      $provide.decorator('$httpBackend', ($delegate, ApiUrl) => {
        $delegate.whenRoute('GET', `${ApiUrl}/me`).respond(200, { });
        $delegate.when('POST', `${ApiUrl}/contacts/${contact.contact_id}/ims`)
          .respond((method, url, data) => {
            const entity = JSON.parse(data);
            if (JSON.stringify(entity) === JSON.stringify(successfulContactDetail)) {
              return [201, entity];
            }

            if (JSON.stringify(entity) === JSON.stringify(failContactDetail)) {
              return [400, { errors: ['invalid'] }];
            }

            return [500, 'DUUUH'];
          });

        return $delegate;
      });
    });
  });

  beforeEach(angular.mock.inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));

  it('init form', inject(($rootScope, $ngRedux) => {
    $ngRedux.dispatch(stateGo('contact', { contact_id: contact.contact_id }));
    $rootScope.$digest();
    const ctrl = $componentController('addContactImForm', null, { contact });

    expect(ctrl.contactDetail).toEqual({});
  }));


  it('add im', inject(($rootScope, $ngRedux, $httpBackend, ApiUrl) => {
    $ngRedux.dispatch(stateGo('contact', { contact_id: contact.contact_id }));
    $rootScope.$digest();
    const bindings = {
      contact,
      onAdd: jasmine.createSpy('onAdd'),
    };
    const ctrl = $componentController('addContactImForm', null, bindings);
    ctrl.contactDetail = successfulContactDetail;
    expect(ctrl.loading).toBe(false);

    ctrl.addContactDetail();
    expect(bindings.onAdd).toHaveBeenCalled();
    expect(ctrl.loading).toBe(true);

    $httpBackend.expectGET(`${ApiUrl}/contacts/${contact.contact_id}`)
      .respond(200, { contacts: contact });
    $httpBackend.flush();
    $rootScope.$digest();

    expect(ctrl.loading).toBe(false);
    expect(ctrl.contactDetail).toEqual({});
  }));

  it('fails to add im', inject(($rootScope, $ngRedux, $httpBackend) => {
    $ngRedux.dispatch(stateGo('contact', { contact_id: contact.contact_id }));
    $rootScope.$digest();
    const bindings = {
      contact,
      onAdd: jasmine.createSpy('onAdd'),
    };
    const ctrl = $componentController('addContactImForm', null, bindings);
    expect(ctrl.loading).toBe(false);
    expect(ctrl.errors.length).toEqual(0);

    ctrl.contactDetail = failContactDetail;
    ctrl.addContactDetail();
    expect(bindings.onAdd).toHaveBeenCalled();
    expect(ctrl.loading).toBe(true);

    $httpBackend.flush();
    expect(ctrl.loading).toBe(false);
    expect(ctrl.contactDetail).toEqual(failContactDetail);
    expect(ctrl.errors).toEqual(['invalid']);
  }));
});
