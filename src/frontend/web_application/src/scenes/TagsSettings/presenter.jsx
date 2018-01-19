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
    tagErrors: {},
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
          createErrors: [(<Trans id="settings.tag.form.error.create_fail">Unable to create the tag. A tag with the same id may already exist.</Trans>)],
        });
      }
    }

    return undefined;
  }

  handleUpdateTag = async ({ original, tag }) => {
    this.setState({
      tagErrors: {
        [original.name]: undefined,
      },
    });
    if (isEqual(original, tag)) {
      return;
    }
    const { updateTag, requestTags } = this.props;
    try {
      await updateTag({ original, tag });
      await requestTags();
    } catch (errors) {
      this.setState({
        tagErrors: {
          [original.name]: errors.map(err => err.message),
        },
      });
    }
  }

  handleDeleteTag = async ({ tag }) => {
    this.setState({
      tagErrors: {
        [tag.name]: undefined,
      },
    });
    const { deleteTag, requestTags } = this.props;
    try {
      await deleteTag({ tag });
      await requestTags();
    } catch (errors) {
      this.setState({
        tagErrors: {
          [tag.name]: errors.map(err => err.message),
        },
      });
    }
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
                  errors={this.state.tagErrors[tag.name]}
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
