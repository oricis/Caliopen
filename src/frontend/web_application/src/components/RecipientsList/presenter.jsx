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

// DropdownController is useless but required by the lib, we just add an empty/invisible element
const DropdownController = withDropdownControl(props => (<span {...props} />));

const getStateFromProps = props => ({
  recipients: props.recipients,
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
    this.handleRemoveRecipient = this.handleRemoveRecipient.bind(this);
    this.handleSearchInputFocus = this.handleSearchInputFocus.bind(this);
    this.handleSearchInputBlur = this.handleSearchInputBlur.bind(this);
    this.state = {
      recipients: [],
      searchTerms: '',
      searchResults: [],
      activeSearchResultIndex: 0,
      searchOpened: false,
    };
  }

  componentWillMount() {
    this.setState(getStateFromProps(this.props));
  }

  componentDidMount() {
    this.props.requestContacts();
  }

  handleRemoveRecipient(participant) {
    this.removeRecipient(participant);
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

  handleSearchInputFocus() {
    this.setState({ searchOpened: true });
  }

  handleSearchInputBlur() {
    this.setState({ searchOpened: false });
  }

  focusSearch() {
    this.searchInputRef.focus();
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

  addParticipant(participant) {
    this.setState(prevState => ({
      recipients: [
        ...prevState.recipients,
        participant,
      ],
    }), () => {
      this.resetSearch();
      this.props.onRecipientsChange(this.state.recipients);
    });
  }

  makeAddKnownParticipant(contact) {
    return () => {
      // FIXME email should not be hardcoded
      const { address } = contact.emails[0];
      this.addParticipant(makeParticipant({
        address,
        label: address,
        contact_ids: [contact.contact_id],
      }));
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

    this.addParticipant(makeParticipant({
      address,
      protocol,
      label: address,
    }));
  }

  eventuallyEditRecipient() {
    if (this.state.searchTerms.length === 0 && this.state.recipients.length) {
      this.editRecipient(
        this.state.recipients[this.state.recipients.length - 1]
      );
    }
  }

  editRecipient(participant) {
    this.removeRecipient(participant);
    this.setState({
      searchTerms: participant.address,
    });
  }

  resetSearch() {
    this.setState({
      searchResults: [],
      searchTerms: '',
      activeSearchResultIndex: 0,
    });
  }

  removeRecipient(participant) {
    this.setState(
      prevState => ({
        recipients: prevState.recipients.filter(curr => curr !== participant),
      }),
      () => {
        this.props.onRecipientsChange(this.state.recipients);
      }
    );
  }

  render() {
    const dropdownId = uuidV1();
    const { __ } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onClick={this.handleClickRecipientList} role="presentation" className="m-recipient-list">
        { !this.state.recipients.length && (
          <span className="m-recipient-list__placeholder">
            {__('messages.compose.form.to.label')}
          </span>
        )}
        {this.state.recipients.map(participant => (
          <Recipient
            key={participant.address}
            className="m-recipient-list__recipient"
            participant={participant}
            onRemove={this.handleRemoveRecipient}
          />
        ))}
        <div className="m-recipient-list__search">
          <input
            ref={(el) => { this.searchInputRef = el; }}
            className="m-recipient-list__search-input"
            onChange={this.handleSearchChange}
            value={this.state.searchTerms}
            onKeyDown={this.handleSearchKeydown}
            onFocus={this.handleSearchInputFocus}
            onBlur={this.handleSearchInputBlur}
          />

          <DropdownMenu
            id={dropdownId}
            show={this.state.searchResults.length && this.state.searchOpened}
            ignore-click-selectors="$ctrl.searchInputElementsSelectors"
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
          <DropdownController toggle={dropdownId} />
        </div>
      </div>
    );
  }
}

export default RecipientList;
