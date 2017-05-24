import { v1 as uuidV1 } from 'uuid';
import { createSelector } from 'reselect';

const contactsSelector = createSelector(
  state => state.contactReducer,
  payload => ({ contacts: payload.contacts.map(contactId => payload.contactsById[contactId]) })
);

const protocolsSelector = createSelector(
  (state, contact) => state.contactReducer.protocolsById[contact.contact_id],
  (state) => state.contactReducer.isFetching,
  (protocols, isContactFetching) => ({ protocols, isContactFetching })
);

const MAX_CONTACT_RESULTS = 5;

export const KEY = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  UP: 38,
  DOWN: 40,
};

export class RecipientListController {
  constructor($scope, $ngRedux, ContactsActions, $filter, protocolsConfig) {
    'ngInject';
    this.$scope = $scope;
    this.$ngRedux = $ngRedux;
    this.ContactsActions = ContactsActions;
    this.$filter = $filter;
    this.protocolsConfig = protocolsConfig;
  }

  $onInit() {
    this.$scope.$on('$destroy', this.$ngRedux.connect(contactsSelector)(this));
    this.$ngRedux.dispatch(this.ContactsActions.fetchContacts(undefined, undefined, 'mock'));
    this.searchTerms = '';
    this.searchResults = [];
    this.activeSearchResultIndex = 0;
    this.searchOpened = false;
    this.id = uuidV1();
    this.searchInputElementsSelectors = [
      `#${this.id}`,
      `#${this.id} .m-recipient-list__search-input`,
    ];
  }

  addRecipient(recipient) {
    this.recipients.push(recipient);
    this.initSearch();
    this.onRecipientsChange({ recipients: this.recipients });
  }

  addKnownRecipient(contact, searchTerms) {
    this.$ngRedux.dispatch(this.ContactsActions.fetchProtocols(contact.contact_id, 'mock'));

    const unsubscribe = this.$ngRedux.subscribe(() => {
      const { protocols, isContactFetching } = protocolsSelector(this.$ngRedux.getState(), contact);

      if (!isContactFetching && !!protocols) {
        unsubscribe();
        const protocol = protocols[0];

        this.addRecipient({
          recipient_id: uuidV1(),
          name: contact.title,
          protocol,
          searchTerms,
          contact_id: contact.contact_id,
        });
      }

      this.isContactFetching = isContactFetching;
    });

    this.searchOpened = false;
  }

  addUnknownRecipient(identifier) {
    const protocolType = Object.keys(this.protocolsConfig).reduce((previous, current) => {
      if (!previous && !!this.protocolsConfig[current].default) {
        return current;
      }

      const regexp = this.protocolsConfig[current].regexp;

      if (!!this.protocolsConfig[previous].default && !!regexp && regexp.test(identifier)) {
        return current;
      }

      return previous;
    });

    this.addRecipient({
      recipient_id: uuidV1(),
      protocol: {
        type: protocolType,
        identifier,
        privacy_index: 0,
      },
      searchTerms: identifier,
    });
  }

  removeRecipient(recipient) {
    this.recipients = this.recipients.filter(current => current !== recipient);
    this.onRecipientsChange({ recipients: this.recipients });
  }

  editRecipient(recipient) {
    this.removeRecipient(recipient);
    this.searchTerms = recipient.searchTerms;
    this.searchOpened = true;
  }

  eventuallyEditRecipient() {
    if (this.searchTerms.length === 0 && this.recipients.length) {
      this.editRecipient(this.recipients[this.recipients.length - 1]);
    }
  }

  focusSearch($event) {
    if ($event.target === $event.currentTarget) {
      this.$scope.$broadcast('recipient-list.search.focus');
    }
  }

  search(searchTerms) {
    if (!!this.searchTerms.length) {
      this.searchResults = this.$filter('filter')(this.contacts, searchTerms)
        .slice(0, MAX_CONTACT_RESULTS);
    } else {
      this.initSearch();
    }
  }

  onSearchKeydown($event) {
    const keyCode = $event.which;

    if ([KEY.ENTER, KEY.UP, KEY.DOWN].indexOf(keyCode) !== -1) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (keyCode === KEY.UP && this.searchResults.length > 0 && this.activeSearchResultIndex > 0) {
      this.activeSearchResultIndex--;
    }

    if (keyCode === KEY.DOWN &&
      this.searchResults.length > 0 &&
      this.activeSearchResultIndex < this.searchResults.length - 1) {
      this.activeSearchResultIndex++;
    }

    if (keyCode === KEY.BACKSPACE) {
      this.eventuallyEditRecipient();
    }
  }

  onSearchKeyup($event) {
    const keyCode = $event.which;

    if (keyCode === KEY.ENTER && this.searchResults.length > 0) {
      this.addKnownRecipient(this.searchResults[this.activeSearchResultIndex], this.searchTerms);
      this.initSearch();
    }

    if (keyCode === KEY.ENTER && this.searchTerms.length > 0) {
      this.addUnknownRecipient(this.searchTerms, this.searchTerms);
      this.initSearch();
    }
  }

  initSearch() {
    this.searchResults = [];
    this.searchTerms = '';
    this.activeSearchResultIndex = 0;
  }

  recipientHasChanged(recipient) {
    this.recipients = this.recipients.map((rcpt) => {
      if (rcpt.recipient_id === recipient.recipient_id) {
        return recipient;
      }

      return rcpt;
    });

    this.onRecipientsChange({ recipients: this.recipients });
  }

  handleSearchInputFocus() {
    this.searchOpened = true;
  }

  dropdownClosed() {
    this.searchOpened = false;
  }
}

const RecipientListComponent = {
  bindings: {
    recipients: '<',
    onRecipientsChange: '&',
  },
  controller: RecipientListController,
  /* eslint-disable max-len */
  template: `
    <div id="{{ $ctrl.id }}" class="m-recipient-list" ng-click="$ctrl.focusSearch($event)">
      <label ng-if="!$ctrl.recipients.length" class="m-recipient-list__placeholder">
        {{ 'messages.compose.form.to.label'|translate }}
      </label>
      <div ng-repeat="recipient in $ctrl.recipients" class="m-recipient-list__recipient">
        <recipient recipient="recipient"
                      on-change-recipient="$ctrl.recipientHasChanged(recipient)"
                      on-remove-recipient="$ctrl.removeRecipient(recipient)"
                      on-edit-recipient="$ctrl.editRecipient(recipient)"></recipient>
      </div>
      <div class="m-recipient-list__search">
        <input type="text"
               class="m-recipient-list__search-input"
               ng-model="$ctrl.searchTerms"
               ng-change="$ctrl.search($ctrl.searchTerms)"
               ng-keydown="$ctrl.onSearchKeydown($event)"
               ng-keyup="$ctrl.onSearchKeyup($event)"
               ng-focus="$ctrl.handleSearchInputFocus()"
               get-focus="recipient-list.search.focus" />

        <dropdown
          is-visible="!!$ctrl.searchResults.length && $ctrl.searchOpened"
          ignore-click-selectors="$ctrl.searchInputElementsSelectors"
          on-close="$ctrl.dropdownClosed()"
        >
          <ul class="m-menu m-menu--vertical">
            <li ng-repeat="contact in $ctrl.searchResults"
                class="m-menu__item m-menu--vertical__item"
            >
              <a ng-click="$ctrl.addKnownRecipient(contact, $ctrl.searchTerms)"
                 class="m-menu__item-content m-link m-recipient-list__search-result"
                 ng-class="{'is-active': $index === $ctrl.activeSearchResultIndex}"
              >
                <span class="m-recipient-list__search-result-title">{{ contact.title }}</span>
                <span class="m-recipient-list__search-result-info">
                  <protocol-icon protocol="{ type: 'email' }"></protocol-icon>
                  <i>{{ contact.emails[0].address }}</i>
                </span>
              </a>
            </li>
          </ul>
        </dropdown>
      </div>
    </div>
  `,
  /* eslint-enable max-len */
};

export default RecipientListComponent;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RecipientList extends Component {
  static propTypes = {
  };
  static defaultProps = {
  };
  constructor(props) {
    super(props);
  }

  render() {
    return ();
  }
}

export default RecipientList;
