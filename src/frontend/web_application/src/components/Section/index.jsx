import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Title from '../Title';
import './style.scss';

class Section extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node,
    descr: PropTypes.node,
    hasSeparator: PropTypes.bool,
    children: PropTypes.node,
    borderContext: PropTypes.oneOf(['disabled', 'safe', 'public', 'unsecure']),
  };

  static defaultProps = {
    className: undefined,
    title: undefined,
    descr: undefined,
    hasSeparator: false,
    children: undefined,
    borderContext: undefined,
  };

  render() {
    const {
      title, descr, children, hasSeparator, className, borderContext,
    } = this.props;

    const borderModifier = borderContext && {
      'm-section--border-disabled': borderContext === 'disabled',
      'm-section--border-safe': borderContext === 'safe',
      'm-section--border-public': borderContext === 'public',
      'm-section--border-unsecure': borderContext === 'unsecure',
    };

    return (
      <section className={classnames('m-section', { 'm-section--separator': hasSeparator }, borderModifier, className)}>
        {(title || descr) &&
          <header className="m-section__header">
            {title && <Title className="m-section__title">{title}</Title>}
            {descr && <p className="m-section__descr">{descr}</p>}
          </header>
        }
        {children}
      </section>
    );
  }
}

export default Section;
