import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import './style.scss';

class Contact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestContact: PropTypes.func.isRequired,
    contactId: PropTypes.string.isRequired,
    contact: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    contact: undefined,
  };

  componentDidMount() {
    const { contactId, requestContact } = this.props;
    requestContact({ contactId });
  }

  render() {
    const { __, isFetching, contact } = this.props;

    return (
      <div>
        <Spinner isLoading={isFetching} />
        {
          contact && (
          <div className="s-contact">
            <div className="s-contact__col-datas-irl">
              {contact && (
                <ContactProfile
                  className="s-contact__contact-profile"
                  contact={contact}
                  onChange={str => str}
                />
              )}
            </div>
            <div className="s-contact__col-datas-online">
              <ContactDetails
                contact={contact}
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
