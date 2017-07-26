import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MultidimensionalPi from '../../components/MultidimensionalPi';
import Title from '../../components/Title';
import TextList, { ItemContent } from '../../components/TextList';

import './style.scss';

class AccountPrivacy extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    // requestUser: PropTypes.func.isRequired,
    // user: PropTypes.shape({}),
  };

  state = {};

  render() {
    const { __ } = this.props;
    const fakePi = { technic: 87, context: 45, comportment: 25 };

    const privacyTips = [
      { name: 'userTip', content: 'Haec dum oriens diu perferret, caeli reserato tepore Constantiu' },
      { name: 'contactTip', content: 'Consulatu suo septies et Caesaris ter egressus Arelate Valentiam' },
      { name: 'deviceTip', content: 'Gundomadum et Vadomarium fratres Alamannorum reges arma moturus' },
      { name: 'tutorialTip', content: 'Quorum crebris excursibus vastabantur confines limitibu.' },
    ];

    return (
      <div className="s-account-privacy">

        <MultidimensionalPi className="s-account-privacy__pi" pi={fakePi} />

        <div className="s-account-privacy__info">
          <Title>{__('account.privacy.improve_pi')}</Title>
          <TextList className="s-account-privacy__tips">
            {privacyTips.map(tip => (
              <ItemContent
                className="s-account-privacy__tip"
                key={tip.name}
              >{tip.content}</ItemContent>
            ))}
          </TextList>
        </div>
      </div>
    );
  }
}

export default AccountPrivacy;
