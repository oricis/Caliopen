import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';

const IdentityDetails = ({ identity }) => (
  <span className="m-identity-details">
    <Icon type={identity.type} rightSpaced />
    {identity.name}
  </span>
  );

IdentityDetails.propTypes = {
  identity: PropTypes.shape({}),
};

IdentityDetails.defaultProps = {
  identity: null,
};


export default IdentityDetails;
