import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Tour from './components/Tour';
import Button from '../../../../components/Button';

class TakeATour extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };
  state = {
    isTourActive: false,
  };

  handleToggleTour = () => {
    this.setState(prevState => ({ isTourActive: !prevState.isTourActive }));
  }

  handleChangeStep = (step) => {
    this.setState({ tourStep: step });
  }

  handleclose = () => {
    this.setState({ isTourActive: false });
  }

  render() {
    const { i18n } = this.props;

    const steps = [
      {
        selector: '.s-timeline',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.intro.title">Welcome!</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n.t`take-a-tour.step.intro.content` }} />
          </div>
        ),
        position: 'center',
      },
      {
        selector: '.l-header__m-search-field',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.search.title">Intuitive search</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n.t`take-a-tour.step.search.content` }} />
          </div>
        ),
      },
      {
        selector: '.l-header__user',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.user-menu.title">Account menu</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n.t`take-a-tour.step.user-menu.content` }} />
          </div>
        ),
        position: 'bottom',
      },
      {
        selector: '.l-call-to-action',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.call-to-action.title">Create quickly</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n.t`take-a-tour.step.call-to-action.content` }} />
          </div>
        ),
      },
      {
        selector: '#toggle-IL_navigation_slider_dropdown',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.importance-slider.title">Importance level</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n.t`take-a-tour.step.importance-slider.content` }} />
          </div>
        ),
      },
    ];

    return (
      <Button onClick={this.handleToggleTour} icon="question-circle" display="expanded">
        <span className="show-for-sr"><Trans id="take-a-tour.action.toggle">Take a tour</Trans></span>
        <Tour
          isOpen={this.state.isTourActive}
          step={this.state.tourStep}
          onRequestClose={this.handleclose}
          steps={steps}
          badgeContent={(current, total) => i18n.t('take-a-tour.current-step', { current, total })}
          showNavigation={false}
          skipButton={i18n.t`take-a-tour.action.skip`}
          prevButton={i18n.t`take-a-tour.action.prev`}
          nextButton={i18n.t`take-a-tour.action.next`}
          lastStepNextButton={i18n.t`take-a-tour.action.last-step`}
          closeButton={i18n.t`take-a-tour.action.close`}
        />
      </Button>
    );
  }
}

export default TakeATour;
