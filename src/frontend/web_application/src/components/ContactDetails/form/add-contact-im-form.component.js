import { createSelector } from 'reselect';

const IM_TYPES = ['work', 'home', 'other', 'netmeeting'];

const imFormSelector = createSelector(
  state => state.contactReducer.contactDetailFormsById,
  state => state.router.currentParams.contact_id,
  (contactDetailState, contactId) => {
    if (!!contactDetailState[contactId] && contactDetailState[contactId].imForm) {
      return contactDetailState[contactId].imForm;
    }

    return {};
  }
);

export class AddContactDetailFormController {
  constructor($scope, $ngRedux, ContactsActions) {
    'ngInject';
    this.$ngRedux = $ngRedux;
    this.ContactsActions = ContactsActions;

    $scope.$on('$destroy', $ngRedux.connect(imFormSelector)(this));

    this.loading = false;
    this.errors = [];
    this.imTypes = IM_TYPES;
    this.contactDetail = {};
  }

  addContactDetail() {
    this.$ngRedux.dispatch(
      this.ContactsActions.addContactDetail(this.contact.contact_id, 'im', this.contactDetail)
    );
    this.onAdd({ $event: { type: 'im', contactDetail: this.contactDetail } });
  }
}

const AddContactImFormComponent = {
  bindings: {
    contact: '<',
    onAdd: '&',
  },
  controller: AddContactDetailFormController,
  /* eslint-disable max-len */
  template: `
    <form ng-submit="$ctrl.addContactDetail()"
      class="s-contact-detail-form" name="im_form">
      <fieldset class="m-fieldset">
        <legend class="m-fieldset__legend">
          <span class="m-text-list__icon fa fa-comment"></span>
          {{ 'contact.im_form.legend'|translate}}
        </legend>
        <div class="s-contact-detail-form__row">
          <div ng-if="$ctrl.errors.length > 0" class="callout alert s-contact-detail-form__group">
            <p ng-repeat="error in $ctrl.errors">{{ error.description }}</p>
          </div>
          <div class="s-contact-detail-form__group s-contact-detail-form__group--medium">
            <label for="im_form_address" class="sr-only">{{ 'contact.im_form.address.label'|translate }}</label>
            <input ng-model="$ctrl.contactDetail.address" type="email" class="m-text-field m-text-field--dark m-text-field--expanded" id="im_form_address" required />
          </div>
          <div class="s-contact-detail-form__group s-contact-detail-form__group--shrink">
            <label for="im_form_type" class="sr-only">{{ 'contact.im_form.im_type.label'|translate }}</label>
            <select ng-model="$ctrl.contactDetail.type"
              ng-options="('contact.im_type.' + imType)|translate for imType in $ctrl.imTypes"
              required="required"
              class="m-text-field m-text-field--dark" id="im_form_type">
            </select>
          </div>
          <div class="s-contact-detail-form__button">
            <button type="submit" class="button primary expanded">
              <span class="fa fa-plus"></span>
              {{ 'contact.action.add_contact_detail'|translate}}
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  `,
  /* eslint-enable max-len */
};

export default AddContactImFormComponent;
