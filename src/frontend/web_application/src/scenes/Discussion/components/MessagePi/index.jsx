import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, i18nMark } from '@lingui/react';
import classnames from 'classnames';
import { getAveragePI, getPiClass, PI_LEVEL_DISABLED, PI_LEVEL_UGLY, PI_LEVEL_BAD, PI_LEVEL_GOOD, PI_LEVEL_SUPER } from '../../../../modules/pi';

import sealedEnvelope from './assets/sealed-envelope.png';
import postalCard from './assets/postal-card.png';

import './style.scss';

class MessagePi extends PureComponent {
  static propTypes = {
    pi: PropTypes.shape({}),
    illustrate: PropTypes.bool,
    describe: PropTypes.bool,
  };

  static defaultProps = {
    pi: undefined,
    illustrate: false,
    describe: false,
  };

  // FIXME: Ugly implenentation.
  getPiQualities = ({ pi }) => {
    /* eslint-disable no-nested-ternary */
    // XXX: temp stuff waiting for actual spec
    const labelFor = aspect => getPiClass(aspect);
    const iconFor = (aspect) => {
      if (Number.isNaN(aspect)) return 'fa-question';

      return aspect <= 33 ? 'fa-times' : aspect <= 66 ? 'fa-warning' : 'fa-check';
    };
    /* eslint-enable no-nested-ternary */
    const { technic, context, comportment } = pi ||
      { technic: NaN, context: NaN, comportment: NaN };

    return {
      technic: { label: labelFor(technic), icon: iconFor(technic) },
      context: { label: labelFor(context), icon: iconFor(context) },
      comportment: { label: labelFor(comportment), icon: iconFor(comportment) },
    };
  }

  getPiImg = ({ pi }) => {
    const piAggregate = getAveragePI(pi);

    // FIXME : add real disabled image.
    if (Number.isNaN(piAggregate)) return 'disabled';

    return piAggregate <= 50 ? postalCard : sealedEnvelope;
  };

  strongSrc = '';
  weakSrc = '';

  renderIllustration() {
    const { pi } = this.props;
    const piQualities = this.getPiQualities({ pi });

    return (
      <div className="m-message-pi__illustration">
        <img src={this.getPiImg({ pi })} alt="" />
        <ul className="m-message-pi__types">
          <li className={piQualities.comportment.label}>
            <i className={`fa ${piQualities.comportment.icon}`} />
            <Trans id="message.pi.comportment">Sender</Trans>
          </li>
          <li className={piQualities.context.label}>
            <i className={`fa ${piQualities.context.icon}`} />
            <Trans id="message.pi.context">Departure</Trans>
          </li>
          <li className={piQualities.technic.label}>
            <i className={`fa ${piQualities.technic.icon}`} />
            <Trans id="message.pi.technic">Travel</Trans>
          </li>
        </ul>
      </div>
    );
  }

  renderDescription = (piAggregate) => {
    const piQuality = getPiClass(piAggregate);

    if (piQuality === PI_LEVEL_DISABLED) {
      return null;
    }

    const metaphors = {
      [PI_LEVEL_UGLY]: i18nMark('message.pi.description.metaphor.ugly'),
      [PI_LEVEL_BAD]: i18nMark('message.pi.description.metaphor.bad'),
      [PI_LEVEL_GOOD]: i18nMark('message.pi.description.metaphor.good'),
      [PI_LEVEL_SUPER]: i18nMark('message.pi.description.metaphor.super'),
    };

    return (
      <p className="m-message-pi__metaphor">
        <Trans key={piQuality} id={metaphors[piQuality]} />
      </p>
    );
  };

  render() {
    const { illustrate, describe, pi } = this.props;
    const piAggregate = getAveragePI(pi);
    const piClass = getPiClass(piAggregate);
    const piValue = piAggregate ? Math.round(piAggregate) : '?';
    const progressMeterStyle = piAggregate ? {
      width: `${piAggregate}%`,
    } : {};

    return (
      <div className="m-message-pi">
        {illustrate ? this.renderIllustration() : null}
        <div className="m-message-pi__meter">
          <div
            className={classnames(['m-message-pi__progress', `m-message-pi__progress--${piClass}`])}
            role="progressbar"
            aria-valuenow={piAggregate}
            aria-valuemax="100"
            tabIndex="0"
          >
            <div
              className={classnames('m-message-pi__progress-meter', `m-message-pi__progress-meter--${piClass}`)}
              style={progressMeterStyle}
            />
          </div>
          <div className="m-message-pi__numeric">
            <span className="m-message-pi__numeric-legend"><Trans id="message.pi.label">Privacy index:</Trans></span>
            <span className="m-message-pi__numeric-value">{piValue}</span>
          </div>
        </div>
        {describe ? this.renderDescription(piAggregate) : null}
      </div>
    );
  }
}

export default MessagePi;
