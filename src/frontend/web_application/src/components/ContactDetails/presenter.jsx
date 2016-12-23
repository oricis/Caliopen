class ContactDetailsContainerController {
  $onInit() {
    this.connectEmailMode = [];
  }

  getRemoteIdentity(identityType, identityId) {
    return this.remoteIdentities
      .find(
        (remoteIdentity) => remoteIdentity.identity_type === identityType
          && remoteIdentity.identity_id === identityId);
  }
}

const ContactDetailsContainerComponent = {
  controller: ContactDetailsContainerController,
  bindings: {
    contact: '<',
    editMode: '<',
    onDeleteContactDetail: '&',
    allowConnectRemoteEntity: '<?',
    onConnectRemoteIdentity: '&?',
    onDisconnectRemoteIdentity: '&?',
    remoteIdentities: '<?',
    props: '<',
  },
  transclude: {
    'contact-details-title': 'contactDetailsTitle',
    'email-form': 'emailForm',
    'im-form': 'imForm',
    'address-form': 'addressForm',
  },
  /* eslint-disable max-len */
  template: `
    <div class="m-contact-details">
      <div ng-transclude="contact-details-title"></div>

      <div class="m-contact-details__list">
        <ul class="m-text-list">
          <li ng-repeat="email in $ctrl.contact.emails|orderBy:'address'">
            <span class="m-text-list__item m-text-list__item--large m-text-line">
              <span class="m-text-list__icon fa fa-envelope"></span>
              <span ng-switch="!!email.is_primary">
                <span ng-switch-when="true" ng-title="'contact.primary'|translate">
                <strong>{{ email.address }}</strong>
                </span>
                <span ng-switch-default>{{ email.address }}</span>
              </span>
              <small><em>{{ ('contact.email_type.' + email.type)|translate}}</em></small>
              <button ng-if="!!$ctrl.allowConnectRemoteEntity"
                ng-click="$ctrl.connectEmailMode[$index] = !$ctrl.connectEmailMode[$index]"
                class="m-link m-link--button"
                ng-class="{'m-link--success':$ctrl.getRemoteIdentity('email',email.email_id).connected}"
              >
                <span class="fa fa-plug"></span>
                <span class="fa fa-caret-down"></span>
                <span class="show-for-sr">{{ 'account.action.connect_identity'|translate }}</span>
              </button>
              <button ng-if="$ctrl.editMode"
                ng-click="$ctrl.onDeleteContactDetail({ $event: { type: 'email', entity: email } })"
                class="m-link m-link--button m-link--alert"
              >
                <i class="fa fa-remove"></i>
                <span class="show-for-sr">
                  {{ 'contact.action.delete_contact_detail'|translate }}
                </span>
              </button>
            </span>
            <span ng-if="!!$ctrl.connectEmailMode[$index] && !!$ctrl.allowConnectRemoteEntity">
              <remote-identity-email
                remote-identity="$ctrl.getRemoteIdentity('email', email.email_id)"
                contact-sub-object-id="email.email_id"
                on-connect="$ctrl.onConnectRemoteIdentity({ $event: $event })"
                on-disconnect="$ctrl.onDisconnectRemoteIdentity({ $event: $event })"
                props="$ctrl.props.remoteIdentity"
              ></remote-identity-email>
            </span>
          </li>

          <li ng-if="!!$ctrl.editMode" class="m-text-list__item" ng-transclude="email-form"></li>

          <li ng-repeat="phone in $ctrl.contact.phones"
            class="m-text-list__item m-text-list__item--large">
            <span class="m-text-line">
              <span class="m-text-list__icon fa fa-phone"></span>
              {{ phone.number }}
              <button ng-if="$ctrl.editMode"
                ng-click="$ctrl.onDeleteContactDetail({ $event: { type: 'phone', entity: phone } })"
                class="m-link m-link--button m-link--alert"
              >
                <i class="fa fa-remove"></i>
                <span class="show-for-sr">
                  {{ 'contact.action.delete_contact_detail'|translate }}
                </span>
              </button>
            </span>
          </li>

          <li ng-repeat="im in $ctrl.contact.ims"
            class="m-text-list__item m-text-list__item--large">
            <span class="m-text-line">
              <span class="m-text-list__icon fa fa-comment"></span>
              {{ im.address }}
              <small><em>{{ ('contact.im_type.' + im.type)|translate }}</em></small>
              <button ng-if="$ctrl.editMode"
                ng-click="$ctrl.onDeleteContactDetail({ $event: { type: 'im', entity: im } })"
                class="m-link m-link--button m-link--alert"
              >
                <i class="fa fa-remove"></i>
                <span class="show-for-sr">
                {{ 'contact.action.delete_contact_detail'|translate }}
                </span>
              </button>
            </span>
          </li>
          <li ng-if="!!$ctrl.editMode" class="m-text-list__item" ng-transclude="im-form"></li>

          <li ng-repeat="address in $ctrl.contact.addresses"
            class="m-text-list__item m-text-line">
            <span class="m-text-list__icon fa fa-map-marker"></span>
            <address class="m-postal-address">
              {{ address.street }}, {{ address.postal_code }} {{ address.city }}
              {{ address.country }} {{ address.region }}
            </adddress>
            <small>
            <em>({{ address.label }} {{ ('contact.address_type.' + address.type)|translate}})</em>
            </small>
            <button ng-if="$ctrl.editMode"
              ng-click="$ctrl.onDeleteContactDetail({ $event: { type: 'address', entity: address } })"
              class="m-link m-link--button m-link--alert"
            >
              <i class="fa fa-remove"></i>
              <span class="show-for-sr">
                {{ 'contact.action.delete_contact_detail'|translate }}
              </span>
            </button>
          </li>
          <li ng-if="!!$ctrl.editMode" class="m-text-list__item" ng-transclude="address-form"></li>
        </ul>
      </div>
    </div>
  `,
  /* eslint-enable max-len */
};

export default ContactDetailsContainerComponent;
