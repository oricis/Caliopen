import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import Subtitle from '../Subtitle';
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
        work: i18n.t`contact.address_type.work`,
        home: i18n.t`contact.address_type.home`,
        other: i18n.t`contact.address_type.other`,
      },
      im_type: {
        work: i18n.t`contact.im_type.work`,
        home: i18n.t`contact.im_type.home`,
        other: i18n.t`contact.im_type.other`,
        netmeeting: i18n.t`contact.im_type.netmeeting`,
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
    const { editMode } = this.props;

    return (
      <div className="m-contact-details">
        <div className="m-contact-details__panel">
          <Subtitle hr>
            <Trans id="contact.contact_details">Contact details</Trans>
          </Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.props.detailForms :
              this.renderContactDetails()
            }
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr><Trans id="contact.contact_organizations">Professional</Trans></Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.props.orgaForms :
              this.renderOrganizationsDetails()
            }
          </div>
        </div>

        <div className="m-contact-details__panel">
          <Subtitle hr><Trans id="contact.contact_identities">Social identity</Trans></Subtitle>
          <div className="m-contact-details__list">
            {editMode ?
              this.props.identityForms :
              this.renderIdentitiesDetails()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ContactDetails;
