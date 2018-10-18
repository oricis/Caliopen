import { compose } from 'redux';
import { withI18n } from '@lingui/react';
import withScrollTarget from '../../../../modules/scroll/hoc/scrollTarget';
import Presenter from './presenter';

export default compose(withI18n(), withScrollTarget())(Presenter);
