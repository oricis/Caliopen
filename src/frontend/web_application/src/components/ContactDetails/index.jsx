import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'lingui-react';
import Section from '../Section';
import TextList, { ItemContent } from '../TextList';
import AddressDetails from './components/AddressDetails';
import BirthdayDetails from './components/BirthdayDetails';
import EmailDetails from './components/EmailDetails';
import IdentityDetails from './components/IdentityDetails';
import ImDetails from './components/ImDetails';
import OrgaDetails from './components/OrgaDetails';
import PhoneDetails from './components/PhoneDetails';
import './style.scss';

@withI18n()
class ContactDetails extends Component {
  static propTypes = {
    contact: PropTypes.shape({}),
    editMode: PropTypes.bool.isRequired,
    detailForms: PropTypes.node.isRequired,
    orgaForms: PropTypes.node.isRequired,
    identityForms: PropTypes.node.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    contact: undefined,
  };

  componentWillMount() {
    this.initDetailsTranslations();
  }

  initDetailsTranslations() {
    const { i18n } = this.props;
    this.detailsTranslations = {
      address_type: {
        work: i18n._('contact.address_type.work', { defaults: 'Professional' }),
        home: i18n._('contact.address_type.home', { defaults: 'Personal' }),
        other: i18n._('contact.address_type.other', { defaults: 'Other' }),
      },
      im_type: {
        work: i18n._('contact.im_type.work', { defaults: 'Professional' }),
        home: i18n._('contact.im_type.home', { defaults: 'Personal' }),
        other: i18n._('contact.im_type.other', { defaults: 'Other' }),
        netmeeting: i18n._('contact.im_type.netmeeting', { defaults: 'Netmeeting' }),
      },
    };
  }

  renderEmail = email => (
    <ItemContent large>
      <EmailDetails email={email} />
    </ItemContent>
  );

  renderPhone = phone => (
    <ItemContent large>
      <PhoneDetails phone={phone} />
    </ItemContent>
  );

  renderIm = im => (
    <ItemContent large>
      <ImDetails im={im} />
    </ItemContent>
  );

  renderAddress = address => (
    <ItemContent large>
      <AddressDetails address={address} />
    </ItemContent>
  );

  renderIdentity = identity => (
    <ItemContent large>
      <IdentityDetails identity={identity} />
    </ItemContent>
  );

  renderOrganization = organization => (
    <ItemContent large>
      <OrgaDetails organization={organization} />
    </ItemContent>
  );

  renderBirthday = birthday => (
    <ItemContent large>
      <BirthdayDetails
        birthday={birthday}
      />
    </ItemContent>
  );

  renderContactDetails = () => {
    const { contact } = this.props;
    const infos = contact && contact.infos ? contact.infos : {};
    const emails = contact && contact.emails ?
      [...contact.emails].sort((a, b) => a.address.localeCompare(b.address)) : [];
    const contactDetails = [
      ...emails.map(detail => this.renderEmail(detail)),
      ...(contact && contact.phones ? contact.phones.map(detail => this.renderPhone(detail)) : []),
      ...(contact && contact.ims ? contact.ims.map(detail => this.renderIm(detail)) : []),
      ...(
        contact && contact.addresses ?
        contact.addresses.map(detail => this.renderAddress(detail)) :
        []
      ),
      ...(infos ? [this.renderBirthday(infos.birthday ? infos.birthday : '')] : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderOrganizationsDetails = () => {
    const { contact } = this.props;

    const contactDetails = [
      ...(contact && contact.organizations ?
        contact.organizations.map(detail => this.renderOrganization(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  renderIdentitiesDetails = () => {
    const { contact } = this.props;

    const contactDetails = [
      ...(contact && contact.identities ?
        contact.identities.map(detail => this.renderIdentity(detail)) : []),
    ];

    return (
      <TextList>
        {contactDetails.map((C, key) => <C.type {...C.props} key={key} />)}
      </TextList>
    );
  }

  render() {
    const { editMode, i18n } = this.props;

    return (
      <div className="m-contact-details">
        <Section
          className="m-contact-details__panel"
          title={i18n._('contact.contact_details', { defaults: 'Contact details' })}
        >
          <div className="m-contact-details__list">
            {editMode ?
              this.props.detailForms :
              this.renderContactDetails()
            }
          </div>
        </Section>

        <Section
          className="m-contact-details__panel"
          title={i18n._('contact.contact_organizations', { defaults: 'Professional' })}
        >
          <div className="m-contact-details__list">
            {editMode ?
              this.props.orgaForms :
              this.renderOrganizationsDetails()
            }
          </div>
        </Section>

        <Section
          className="m-contact-details__panel"
          title={i18n._('ontact.contact_identities', { defaults: 'Social identity' })}
        >
          <div className="m-contact-details__list">
            {editMode ?
              this.props.identityForms :
              this.renderIdentitiesDetails()
            }
          </div>
        </Section>
      </div>
    );
  }
}

export default ContactDetails;
