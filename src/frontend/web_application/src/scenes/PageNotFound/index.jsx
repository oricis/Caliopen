import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import PageTitle from '../../components/PageTitle';

@withI18n()
class PageNotFound extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };

  render() {
    const { i18n } = this.props;

    return (
      <div>
        <PageTitle title={i18n._('page_not_found.title', { defaults: 'Page not found.' })} />
        <Trans id="page_not_found.title">
          Page not found
        </Trans>
      </div>
    );
  }
}

export default PageNotFound;
