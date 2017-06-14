import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import './style.scss';

class Contact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      isFetching: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.loadContact();
    }, 2000);
  }

  loadContact() {
    this.setState({
      /* eslint-disable */
      contact: {
        "addresses": [{
          "address_id": '327707a-eefc-6724-bv28-85f1c9d197b',
          "city": '',
          "country": 'Amphibios 9',
          "is_primary": false,
          "label": '',
          "postal_code": '',
          "region": '',
          "street": '',
        }],
        "privacy_features": {},
        "phones": [{
          "number": '00 00 00 00 00',
        }],
        "contact_id": "0327707a-eefc-6724-bv28-85f1c9d197bb",
        "date_insert": "2016-05-09T15:01:42.381000",
        "identities": [{
          type: "twitter",
          value: "@me"
        }, {
          type: "facebook",
          value: "blablabla"
        }],
        "user_id": "355489c3-olds-4e41-b490-5f4dd317aa53",
        "title": "Kif",
        "additional_name": null,
        "date_update": null,
        "organizations": [{
          "organization_id": '9c3-olds-4e41-b490',
          "department": 'Nimbus spaceship',
          "job_description": 'Lieutenant',
          "name": 'DOOP',
          "is_primary": true,
        }],
        "ims": [],
        "given_name": "Kif",
        "name_prefix": 'Lieutenant',
        "deleted": 0,
        "privacy_index": [{ name: 'behavioral', level: 87 }, { name: 'contextual', level: 45 }, { name: 'technical', level: 25 }],
        "tags": ["Aliens", "DOOP", "Amphibians"],
        "infos": {
          "birthday": "2016-05-09T15:01:42.381000",
        },
        "emails": [{
          "email_id": "0327707a-4398-4bd4-9bd5-20020001",
          "is_primary": 0,
          "date_update": null,
          "label": null,
          "address": "kroker@caliopen.local",
          "date_insert": "2016-05-09T15:01:42.116000",
          "type": "other"
        }, {
          "email_id": "0327707a-4398-4bd4-9dd5-20043201",
          "is_primary": 0,
          "date_update": null,
          "label": null,
          "address": "kroker@gmail.com",
          "date_insert": "2017-05-09T15:01:42.116000",
          "type": "home"
        }],
        "family_name": "Kroker",
        "name_suffix": null,
        "avatar": "avatar.png",
        "public_keys": []
      },
      /* eslint-enable */
    });
    this.setState({ isFetching: false });
  }

  render() {
    const { __ } = this.props;

    return (
      <div>
        <Spinner isLoading={this.state.isFetching} />
        {
          this.state.contact && (
          <div className="s-contact">
            <div className="s-contact__col-datas-irl">
              {this.state.contact && (
                <ContactProfile
                  className="s-contact__contact-profile"
                  contact={this.state.contact}
                  onChange={str => str}
                />
              )}
            </div>
            <div className="s-contact__col-datas-online">
              <ContactDetails
                contact={this.state.contact}
                onAddContactDetail={str => str}
                onDeleteContactDetail={str => str}
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

export default Contact;
