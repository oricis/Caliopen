import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Link, Icon, VerticalMenu, VerticalMenuItem } from '../../../../components/';
import TabList from './components/TabList';
import TimelineFilterSelector from './components/TimelineFilterSwitcher';
import SliderContainer from '../ImportanceSliderContainer';
import UserInfo from '../UserInfo';
import { getLabels } from '../../../../services/application-manager';
import './style.scss';

class NavigationAlt extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    currentApplication: PropTypes.shape({}).isRequired,
    onClickApp: PropTypes.func.isRequired,
  };
  static defaultProps = {
  };

  createHandleClickApp = app => () => this.props.onClickApp(app);

  render() {
    const { currentApplication, applications, i18n } = this.props;
    const applicationLabels = getLabels(i18n);

    return (
      <div className="l-nav-alt">
        <UserInfo className="l-nav-alt__user" />
        <VerticalMenu className="l-nav-alt__menu">
          {
            applications.map(application => (
              <VerticalMenuItem key={application.name}>
                <Link
                  to={application.route}
                  onClick={this.createHandleClickApp(application)}
                  button
                  expanded
                  active={currentApplication === application}
                  data-toggle="left_off_canvas"
                >
                  <Icon type={application.icon} />
                  {' '}
                  {applicationLabels[application.name]}
                </Link>
              </VerticalMenuItem>
            ))
          }
          <VerticalMenuItem className="l-nav-alt__filter">
            <Icon type="filter" className="l-nav-alt__timeline-filter-icon" />
            <TimelineFilterSelector className="l-nav-alt__timeline-filter" />
          </VerticalMenuItem>
        </VerticalMenu>
        <TabList />
        <VerticalMenu className="l-nav-alt__menu">
          <VerticalMenuItem className="l-nav-alt__importance-slider">
            <Icon type="warning" className="l-nav-alt__importance-slider-icon" />
            <SliderContainer className="l-nav-alt__slider" />
          </VerticalMenuItem>
        </VerticalMenu>
        <VerticalMenu className="l-nav-alt__menu">
          <VerticalMenuItem>
            <Link to="/user/profile" button expanded data-toggle="left_off_canvas">
              <Trans id="header.menu.account">Account</Trans>
            </Link>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <Link to="/settings/application" button expanded data-toggle="left_off_canvas">
              <Trans id="header.menu.settings">Settings</Trans>
            </Link>
          </VerticalMenuItem>
          <VerticalMenuItem>
            <Link href="/auth/signout" button expanded data-toggle="left_off_canvas">
              <Trans id="header.menu.signout">Signout</Trans>
            </Link>
          </VerticalMenuItem>
        </VerticalMenu>
      </div>
    );
  }
}

export default NavigationAlt;
