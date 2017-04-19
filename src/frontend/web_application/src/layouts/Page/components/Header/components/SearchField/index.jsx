import React from 'react';
import PropTypes from 'prop-types';
import { withTranslator } from '@gandi/react-translate';
import './style.scss';
import { InputText } from '../../../../../../components/form';
import Icon from '../../../../../../components/Icon';
import { RawButton } from '../../../../../../components/Button';

const SearchField = ({ __ }) => (
  <div className="m-search-field">
    <form>
      <InputText
        placeholder={__('header.menu.search')}
        className="m-search-field__input m-input-text"
      />
      <RawButton
        className="m-search-field__button"
        type="submit"
        aria-label={__('header.menu.search')}
      ><Icon type="search" /></RawButton>
    </form>
  </div>
);

SearchField.propTypes = {
  __: PropTypes.func.isRequired,
};

export default withTranslator()(SearchField);
