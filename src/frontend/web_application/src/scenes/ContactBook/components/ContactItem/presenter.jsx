import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans } from 'lingui-react';
import { ContactAvatarLetter, SIZE_MEDIUM } from '../../../../modules/avatar';
import { Link, TextBlock, Icon, Checkbox, Badge, PlaceholderBlock } from '../../../../components/';
import { formatName } from '../../../../services/contact';
import './style.scss';

const getAddress = ({ attrName, attr }) => {
  switch (attrName) {
    case 'emails':
      return {
        type: 'email',
        identifier: attr.address,
      };

    case 'phones':
      return {
        type: 'phone',
        identifier: attr.number,
      };

    case 'identities':
      return {
        type: attr.type,
        identifier: attr.identifier,
      };

    case 'ims':
      return {
        type: 'comment',
        identifier: attr.address,
      };
    default:
      console.warn('Unable to render the main address for:');
      console.table(attr);

      return undefined;
  }
};

const getMainAddresses = ({ contact }) => ['emails', 'phones', 'identities', 'ims'].reduce((acc, attrName) => {
  if (acc.length === 2) {
    return acc;
  }

  if (!contact[attrName]) {
    return acc;
  }

  const mainAddress = contact[attrName].reduce((attrAcc, attr) => {
    if (!attrAcc) {
      return getAddress({ attrName, attr });
    }

    if (attr.is_primary) {
      return getAddress({ attrName, attr });
    }

    return attrAcc;
  }, undefined);

  if (!mainAddress) {
    return acc;
  }

  return [
    ...acc,
    mainAddress,
  ];
}, []);

class ContactItem extends PureComponent {
  static propTypes = {
    contact: PropTypes.shape({}),
    contactDisplayFormat: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSelectEntity: PropTypes.func.isRequired,
    isContactSelected: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    contact: undefined,
    className: undefined,
  };

  onCheckboxChange = (ev) => {
    const { contact, onSelectEntity } = this.props;
    const { checked } = ev.target;

    onSelectEntity(checked ? 'add' : 'remove', contact.contact_id);
  }

  renderPlaceholder() {
    const { className } = this.props;

    return (
      <div className={classnames('m-contact-item', className)}>
        <div className="m-contact-item__title">
          <div className="m-contact-item__avatar">
            <PlaceholderBlock shape="avatar" />
          </div>
          <div className="m-contact-item__contact">
            <div className="m-contact-item__name">
              <PlaceholderBlock shape="line" />
            </div>
            <div className="m-contact-item__tags" />
          </div>
        </div>
        <div className="m-contact-item__info">
          <PlaceholderBlock />
        </div>
        <div className="m-contact-item__select">
          &nbsp;
        </div>
      </div>
    );
  }

  render() {
    const {
      contact, contactDisplayFormat: format, className, isContactSelected,
    } = this.props;

    if (!contact) {
      return this.renderPlaceholder();
    }

    const contactTitle = formatName({ contact, format });
    const mainAddresses = getMainAddresses({ contact });

    return (
      <div className={classnames('m-contact-item', className)}>
        <Link noDecoration to={`/contacts/${contact.contact_id}`} className="m-contact-item__title">
          <div className="m-contact-item__avatar">
            <ContactAvatarLetter
              isRound
              contact={contact}
              size={SIZE_MEDIUM}
              contactDisplayFormat={format}
            />
          </div>
          <div className="m-contact-item__contact">
            <TextBlock className="m-contact-item__name">
              {contact.name_prefix && (<span className="m-contact-item__contact-prefix">{contact.name_prefix}</span>)}
              <span className="m-contact-item__contact-title">{contactTitle}</span>
              {contact.name_suffix && (<span className="m-contact-item__contact-suffix">, {contact.name_suffix}</span>)}
            </TextBlock>
            <div className="m-contact-item__tags">
              {contact.tags && contact.tags.map(tag => (
                <Badge key={tag} rightSpaced>{tag}</Badge>
              ))}
            </div>
          </div>
        </Link>
        <div className="m-contact-item__info">
          {mainAddresses.map(address => (
            <TextBlock key={address.identifier}>
              <Icon type={address.type} />
              {' '}
              {address.identifier}
            </TextBlock>
          ))}
        </div>
        <TextBlock className="m-contact-item__select">
          <Checkbox
            label={<Trans id="contact-book.action.select">Select the contact</Trans>}
            showLabelforSr
            onChange={this.onCheckboxChange}
            checked={isContactSelected}
          />
        </TextBlock>
      </div>
    );
  }
}

export default ContactItem;
