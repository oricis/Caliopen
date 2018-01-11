import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { Trans } from 'lingui-react';
import { WithTags } from '../../modules/tags';
import Section from '../../components/Section';
import TagSearch from './components/TagSearch';
import TagInput from './components/TagInput';
import './style.scss';

class TagsSettings extends Component {
  static propTypes = {
    requestTags: PropTypes.func.isRequired,
    createTag: PropTypes.func.isRequired,
    updateTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: [],
    isFetching: false,
  };

  state = {
    createErrors: [],
    searchTerms: '',
    foundTags: [],
  };

  handleSearchChange = searchTerms => this.setState({ searchTerms, createErrors: [] });

  handleCreateTag = async (searchTerms) => {
    if (searchTerms.length > 0) {
      const { createTag, requestTags } = this.props;
      try {
        await createTag({ label: searchTerms });
        this.handleSearchChange('');
        await requestTags();
      } catch (err) {
        this.setState({
          createErrors: [(<Trans id="settings.tag.form.error.create_fail">Unable to create the tag. A tag with the same id may already exists.</Trans>)],
        });
      }
    }

    return undefined;
  }

  handleUpdateTag = async ({ original, tag }) => {
    if (isEqual(original, tag)) {
      return;
    }
    const { updateTag, requestTags } = this.props;
    await updateTag({ original, tag });
    await requestTags();
  }

  handleDeleteTag = async ({ tag }) => {
    const { deleteTag, requestTags } = this.props;
    await deleteTag({ tag });
    await requestTags();
  }

  render() {
    return (
      <WithTags render={
        userTags => (
          <div className="s-tags-settings">
            <Section className="s-tags-settings__tags" title={<Trans id="settings.tags.title">Tags</Trans>}>
              {userTags.map(tag => (
                <TagInput
                  key={tag.name}
                  tag={tag}
                  onUpdateTag={this.handleUpdateTag}
                  onDeleteTag={this.handleDeleteTag}
                />
              ))}
            </Section>
            <Section className="s-tags-settings__search">
              <TagSearch
                onChange={this.handleSearchChange}
                errors={this.state.createErrors}
                terms={this.state.searchTerms}
                onSubmit={this.handleCreateTag}
              />
            </Section>
          </div>
        )}
      />
    );
  }
}

export default TagsSettings;
