import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro'; // eslint-disable-line import/no-extraneous-dependencies
import Tour from './components/Tour';
import { Button, Link } from '../../../../components/';
import './style.scss';

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
            <div>
              <Trans id="take-a-tour.step.intro.content">
                <p>
                  With using  Caliopen, you can access to all of your private messages (Email, and
                  more to come) through a single login.
                </p>
                <p>
                  Now, take a look at our main features, such as unified message management,
                  intuitive search and more!
                </p>
                <p>
                  The first time, the timeline might look a bit empty, you can easily
                  <Link to="/user/identities">add a provider</Link>
                </p>
              </Trans>
            </div>
          </div>
        ),
        position: 'center',
      },
      {
        selector: '.m-page-actions__search-field',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.search.title">Intuitive search</Trans></h2>
            <div>
              <Trans id="take-a-tour.step.search.content">
                <p>
                  Every search can include filters. All of the unencrypted data can be searched.
                </p>
                <p>Here you can search everything in your messages and contacts.</p>
              </Trans>
            </div>
          </div>
        ),
      },
      {
        selector: '.m-user-menu',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.user-menu.title">Account menu</Trans></h2>
            <div>
              <Trans id="take-a-tour.step.user-menu.content">
                <p>Keep up-to-date your account information and manage your settings from here!</p>
                <p>Customize your application in your settings.</p>
                <p>And connect providers like Gmail or Twitter.</p>
              </Trans>
            </div>
          </div>
        ),
        position: 'bottom',
      },
      {
        selector: '.m-page-actions__action-btns',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.call-to-action.title">Create quickly</Trans></h2>
            <div>
              <Trans id="take-a-tour.step.call-to-action.content">
                <p>Create a new message on the fly.</p>
              </Trans>
            </div>
          </div>
        ),
      },
    ];

    return (
      <Button onClick={this.handleToggleTour} icon="question-circle" display="expanded" className="m-take-a-tour">
        <Trans id="take-a-tour.action.toggle">Take a tour</Trans>
        <Tour
          isOpen={this.state.isTourActive}
          step={this.state.tourStep}
          onRequestClose={this.handleclose}
          steps={steps}
          badgeContent={(current, total) => (<Trans id="take-a-tour.current-step">Take a tour ({current} of {total})</Trans>)}
          showNavigation={false}
          skipButton={i18n._('take-a-tour.action.skip', null, { defaults: 'Skip' })}
          prevButton={i18n._('take-a-tour.action.prev', null, { defaults: 'Previous' })}
          nextButton={i18n._('take-a-tour.action.next', null, { defaults: 'Next' })}
          lastStepNextButton={i18n._('take-a-tour.action.last-step', null, { defaults: 'Finish' })}
          closeButton={i18n._('take-a-tour.action.close', null, { defaults: 'Close' })}
        />
      </Button>
    );
  }
}

export default TakeATour;
