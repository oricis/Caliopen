import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// TODO : PlaceHolder for now.
class QuickReplyForm extends PureComponent {
  static propTypes = {
    draft: PropTypes.string,
  };

  static defaultProps = {
    draft: { body: 'Réponse rapide par mail' },
  };

  state = {};

  render() {
    return (
      <div className="quick-reply">
        {this.props.draft.body}
      </div>
    );
  }
}

export default QuickReplyForm;
