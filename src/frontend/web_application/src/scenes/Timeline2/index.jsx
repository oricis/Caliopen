import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import getClient from '../../services/api-client';
import StickyNavBar from '../../layouts/Page/components/Navigation/components/StickyNavBar';
import { Checkbox, Spinner } from '../../components';
import withScrollManager from '../../modules/scroll/hoc/scrollManager';
import DiscussionItem from './components/DiscussionItem';

import './style.scss';

@withScrollManager()
class Home extends Component {
  constructor(props) {
    super(props);
    this.client = getClient();
    this.state = {};

    this.client.get('/api/v1/discussions')
      .then((response) => { this.setState({ discussions: response.data.discussions }); });
  }

  renderDiscussions() {
    const { discussions } = this.state;

    if (discussions) {
      return (
        <ul className="s-discussion-list">
          {discussions.map(discussion => (
            <DiscussionItem key="discussion.discussion_id" discussion={discussion} />
          ))}
        </ul>);
    }

    return (<Spinner isLoading />);
  }

  render() {
    return (
      <section id="discussions" className="s-timeline">
        <StickyNavBar className="action-bar" stickyClassName="sticky-action-bar">
          <header className="s-timeline__action-bar">
            <div className="s-timeline__select-all">
              <Checkbox label="" />
            </div>
          </header>
        </StickyNavBar>
        { this.renderDiscussions() }
      </section>);
  }
}

export default Home;
