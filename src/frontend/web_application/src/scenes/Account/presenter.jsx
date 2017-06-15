import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import Spinner from '../../components/Spinner';
import Icon from '../../components/Icon';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import TextBlock from '../../components/TextBlock';
import { CheckboxFieldGroup } from '../../components/form';
import AccountOpenPGPKeys from './components/AccountOpenPGPKeys';
import './style.scss';

@withTranslator()
class Account extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    onContactProfileChange: PropTypes.func.isRequired,
    setMainAddress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      isFetching: true,
    };
    this.handleAddContactdetail = this.handleAddContactdetail.bind(this);
    this.handleDeleteContactDetail = this.handleDeleteContactDetail.bind(this);
    this.handleConnectRemoteIdentity = this.handleConnectRemoteIdentity.bind(this);
    this.handleDisonnectRemoteIdentity = this.handleDisonnectRemoteIdentity.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.loadUser();
    }, 2000);
  }

  loadUser() {
    this.setState({
      /* eslint-disable */
      user: {
        "family_name": null,
        "user_id": "344489c3-fc63-4e41-b490-5f4dd317aa50",
        "name": "test@caliopen.local",
        "privacy_features": {},
        "main_user_id": null,
        "date_insert": "2016-05-09T15:01:39.924000",
        "contact": {
          "addresses": [], "privacy_features": {}, "phones": [], "contact_id": "19c3ce42-e3ba-46e7-984f-4c3e8de11c05", "date_insert": "2016-05-09T15:01:40.034000", "identities": [], "user_id": "344489c3-fc63-4e41-b490-5f4dd317aa50", "title": "John Doe", "additional_name": null, "date_update": null,
          "organizations": [{
            "organization_id": '9c3-olds-4e41-b490',
            "department": 'Caliopen',
            "job_description": 'Dev',
            "name": 'Gandi',
            "is_primary": true,
          }],
          "privacy_index": [{ name: 'behavioral', level: 87 }, { name: 'contextual', level: 45 }, { name: 'technical', level: 25 }],
          "ims": [], "given_name": "John", "name_prefix": null,
          "tags": [], "deleted": 0,
          "groups": [], "infos": {},
          "emails": [{"email_id": "93f03145-4398-4bd4-9bd5-00000100", "is_primary": 0, "date_update": null, "label": null, "address": "contact@john.doe", "date_insert": "2016-05-09T15:01:43.116000", "type": "other"}],
          "family_name": "Doe", "name_suffix": null, "avatar": "avatar.png", "public_keys": []
        },
        "remoteIdentities": [],
        "params": {}, "given_name": null}
      /* eslint-enable */
    });
    this.setState({ isFetching: false });
  }

  /* eslint-disable class-methods-use-this */
  handleAddContactdetail() {
    // console.log(ev);
    // TODO: manage redux dispatch here
    // this.$ngRedux.dispatch(this.UserActions.invalidate());
  }
  //
  handleDeleteContactDetail() {
    // const contactId = this.user.contact.contact_id;
    // this.$ngRedux.dispatch(dispatch => {
    //   dispatch(this.ContactsActions.deleteContactDetail(type, contactId, entity));
    //   dispatch(this.UserActions.invalidate());
    // });
  }
  //
  handleConnectRemoteIdentity() {
    // this.$ngRedux.dispatch((dispatch) => {
    //   if (!remoteIdentity.remote_identity_id) {
    //     dispatch(this.RemoteIdentityActions.addRemoteIdentity(remoteIdentity));
    //   } else {
    //     dispatch(this.RemoteIdentityActions.updateRemoteIdentityParams(remoteIdentity));
    //     dispatch(this.RemoteIdentityActions.connect(remoteIdentity));
    //   }
    // });
  }

  handleDisonnectRemoteIdentity() {
    // this.$ngRedux.dispatch(this.RemoteIdentityActions.disconnect(remoteIdentity));
  }


  render() {
    const { onContactProfileChange, setMainAddress, __ } = this.props;

    return (
      <div>
        <Spinner isLoading={this.state.isFetching} />
        {
          this.state.user && (
          <div className="s-account">
            <div className="s-account__col-datas-irl">
              {this.state.user.contact && (
                <ContactProfile
                  className="s-account__contact-profile"
                  contact={this.state.user.contact}
                  onChange={onContactProfileChange}
                />
              )}

              <TextBlock>
                <Icon type="envelope" /> {this.state.user.name}
                <span className="pull-right">
                  {__('account.primary_email_label')}
                  {' '}
                  <CheckboxFieldGroup
                    displaySwitch
                    showTextLabel={false}
                    label={__('account.action.is_primary')}
                    value={this.state.mainAddress}
                    onChange={setMainAddress}
                  />
                </span>
              </TextBlock>

              <div className="s-account__openpgp">
                <AccountOpenPGPKeys user={this.state.user} />
              </div>

            </div>
            <div className="s-account__col-datas-online">
              <ContactDetails
                contact={this.state.user.contact}
                remoteIdentities={this.state.user.remoteIdentities}
                onConnectRemoteIdentity={this.handleConnectRemoteIdentity}
                onDisconnectRemoteIdentity={this.handleDisonnectRemoteIdentity}
                onAddContactDetail={this.handleAddContactdetail}
                onDeleteContactDetail={this.handleDeleteContactDetail}
                allowConnectRemoteEntity
                __={__}
              />
            </div>
          </div>
          )
        }
      </div>
    );
  }
}

export default Account;
