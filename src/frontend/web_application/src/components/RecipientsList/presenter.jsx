import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidV1 } from 'uuid';
import classnames from 'classnames';
import DropdownMenu, { withDropdownControl } from '../DropdownMenu';
import Button from '../Button';
import Icon from '../Icon';
import VerticalMenu, { VerticalMenuItem } from '../VerticalMenu';
import filterContact from '../../services/filter-contacts';
import protocolsConfig from '../../services/protocols-config';
import Recipient from './components/Recipient';
import './style.scss';

const MAX_CONTACT_RESULTS = 5;

export const KEY = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  UP: 38,
  DOWN: 40,
};

const makeParticipant = ({
  address,
  protocol = 'email',
  label,
  contact_ids,
  type = 'To',
}) => ({
  address,
  protocol,
  label,
  contact_ids,
  type,
});

const Input = withDropdownControl(props => (<input type="text" {...props} />));

const getStateFromProps = props => ({
  participantsAndSearchTerms: props.recipients.map(participant => ({ participant })),
});

class RecipientList extends Component {
  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape()),
    recipients: PropTypes.arrayOf(PropTypes.shape()),
    onRecipientsChange: PropTypes.func,
    requestContacts: PropTypes.func,
    __: PropTypes.func.isRequired,
  };
  static defaultProps = {
    contacts: [],
    recipients: [],
    onRecipientsChange: () => {},
    requestContacts: () => {},
  };
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchKeydown = this.handleSearchKeydown.bind(this);
    this.handleClickRecipientList = this.handleClickRecipientList.bind(this);
    this.state = {
      participantsAndSearchTerms: [],
      searchTerms: '',
      searchResults: [],
      activeSearchResultIndex: 0,
    };
  }

  componentWillMount() {
    this.setState(getStateFromProps(this.props));
  }

  componentDidMount() {
    this.props.requestContacts();
  }

  handleRemoveRecipient(recipient) {
    this.removeRecipient(recipient);
  }

  handleSearchChange(ev) {
    this.setState({
      searchTerms: ev.target.value,
    }, () => this.search(this.state.searchTerms));
  }

  handleClickRecipientList(ev) {
    if (ev.target === ev.currentTarget) {
      this.focusSearch();
    }
  }

  // eslint-disable-next-line
  focusSearch(ev) {
    // XXX
    this.$scope.$broadcast('recipient-list.search.focus');
  }

  search(searchTerms) {
    if (this.state.searchTerms.length) {
      const { contacts } = this.props;
      this.setState({
        searchResults: filterContact({ contacts, searchTerms }).slice(0, MAX_CONTACT_RESULTS),
      });
    } else {
      this.resetSearch();
    }
  }

  handleSearchKeydown(ev) {
    const { which: keyCode } = ev;

    if ([KEY.ENTER, KEY.UP, KEY.DOWN].indexOf(keyCode) !== -1) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (keyCode === KEY.UP &&
      this.state.searchResults.length > 0 &&
      this.state.activeSearchResultIndex > 0) {
      this.setState(prevState => ({
        activeSearchResultIndex: prevState.activeSearchResultIndex - 1,
      }));
    }

    if (keyCode === KEY.DOWN &&
      this.state.searchResults.length > 0 &&
      this.state.activeSearchResultIndex < this.state.searchResults.length - 1) {
      this.setState(prevState => ({
        activeSearchResultIndex: prevState.activeSearchResultIndex + 1,
      }));
    }

    if (keyCode === KEY.BACKSPACE) {
      this.eventuallyEditRecipient();
    }

    if (keyCode === KEY.ENTER && this.state.searchResults.length > 0) {
      this.makeAddKnownParticipant(
        this.state.searchResults[this.state.activeSearchResultIndex],
        this.state.searchTerms
      )();
      this.resetSearch();
    } else if (keyCode === KEY.ENTER && this.state.searchTerms.length > 0) {
      this.addUnknownParticipant(this.state.searchTerms);
      this.resetSearch();
    }
  }

  addParticipant({ participant, searchTerms }) {
    this.setState(prevState => ({
      participantsAndSearchTerms: [
        ...prevState.participantsAndSearchTerms,
        { participant, searchTerms },
      ],
    }), () => {
      this.resetSearch();
      this.props.onRecipientsChange(
        this.state.participantsAndSearchTerms.map(({ participant: part }) => part),
      );
    });
  }

  makeAddKnownParticipant(contact, searchTerms) {
    return () => {
      // FIXME email should not be hardcoded
      const { address } = contact.emails[0];
      this.addParticipant({
        participant: makeParticipant({
          address,
          label: address,
          contact_ids: [contact.contact_id],
        }),
        searchTerms,
      });

      // TODO
      this.setState({ searchOpened: false });
    };
  }

  addUnknownParticipant(address) {
    const protocol = Object.keys(protocolsConfig).reduce((previous, current) => {
      if (!previous && protocolsConfig[current].default) {
        return current;
      }

      const { regexp } = protocolsConfig[current];

      if (protocolsConfig[previous].default && regexp && regexp.test(address)) {
        return current;
      }

      return previous;
    });

    this.addParticipant({
      participant: makeParticipant({
        address,
        protocol,
        label: address,
      }),
      searchTerms: address,
    });
  }

  eventuallyEditRecipient() {
    if (this.state.searchTerms.length === 0 && this.state.participantsAndSearchTerms.length) {
      this.editRecipient(
        this.state.participantsAndSearchTerms[this.state.participantsAndSearchTerms.length - 1]
      );
    }
  }

  editRecipient(recipient) {
    this.removeRecipient(recipient);
    this.setState({
      searchTerms: recipient.participant.address,
    });
    this.searchOpened = true;
  }

  handleRecipientChange(recipient) {
    this.setState(prevState => ({
      participantsAndSearchTerms: prevState.participantsAndSearchTerms.map((rcpt) => {
        // FIXME: there's no recipient_id
        if (rcpt.recipient_id === recipient.recipient_id) {
          return recipient;
        }

        return rcpt;
      }),
    }), () => {
      this.props.onRecipientsChange(
        this.state.participantsAndSearchTerms.map(({ participant }) => participant),
      );
    });
  }

  resetSearch() {
    this.setState({
      searchResults: [],
      searchTerms: '',
      activeSearchResultIndex: 0,
    });
  }

  removeRecipient(recipient) {
    this.setState(
      prevState => ({
        participantsAndSearchTerms: prevState.participantsAndSearchTerms
          .filter(curr => curr.participant !== recipient.participant),
      }),
      () => {
        this.props.onRecipientsChange(
          this.state.participantsAndSearchTerms.map(({ participant }) => participant),
        );
      }
    );
  }

  render() {
    const dropdownId = uuidV1();
    const { __ } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onClick={this.handleClickRecipientList} role="presentation" className="m-recipient-list">
        { !this.state.participantsAndSearchTerms.length && (
          <span className="m-recipient-list__placeholder">
            {__('messages.compose.form.to.label')}
          </span>
        )}
        {this.state.participantsAndSearchTerms.map(({ participant, searchTerms }) => (
          <Recipient
            key={participant.address}
            className="m-recipient-list__recipient"
            participant={participant}
            searchTerms={searchTerms}
            onChange={this.handleRecipientChange}
            onEdit={this.editRecipient}
            onRemove={this.handleRemoveRecipient}
          />
        ))}
        <div className="m-recipient-list__search">
          <Input
            toggle={dropdownId}
            className="m-recipient-list__search-input"
            onChange={this.handleSearchChange}
            value={this.state.searchTerms}
            onKeyDown={this.handleSearchKeydown}
            onFocus={this.handleSearchInputFocus}
            get-focus="recipient-list.search.focus"
          />

          <DropdownMenu
            id={dropdownId}
            is-visible="!!$ctrl.searchResults.length && $ctrl.searchOpened"
            ignore-click-selectors="$ctrl.searchInputElementsSelectors"
            on-close="$ctrl.dropdownClosed()"
          >
            <VerticalMenu>
              {this.state.searchResults.map((contact, index) => (
                <VerticalMenuItem key={contact.contact_id}>
                  <Button
                    onClick={this.makeAddKnownParticipant(contact, this.state.searchTerms)}
                    className={classnames('m-recipient-list__search-result', { 'is-active': index === this.state.activeSearchResultIndex })}
                  >
                    <span className="m-recipient-list__search-result-title">{contact.title}</span>
                    <span className="m-recipient-list__search-result-info">
                      <Icon type="email" />
                      <i>{contact.emails[0].address}</i>
                    </span>
                  </Button>
                </VerticalMenuItem>
              ))}
            </VerticalMenu>
          </DropdownMenu>
        </div>
      </div>
    );
  }
}

export default RecipientList;
