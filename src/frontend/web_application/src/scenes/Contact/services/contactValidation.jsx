import React from 'react';
import { Trans } from '@lingui/react';
import { IDENTITY_TYPE_TWITTER } from '../../../modules/contact';
import protocolsConfig from '../../../services/protocols-config';

const twitterHandleRegExpr = protocolsConfig.twitter.regexp;

export const contactValidation = (values) => {
  const errors = {};

  const identityErrors = !values.identities ? [] : values.identities
    .map((identity) => {
      const identityError = {};
      let hasError = false;
      if (!identity.type || !identity.type) {
        identityError.type = 'type missng';
        hasError = true;
      }

      if (identity.type === IDENTITY_TYPE_TWITTER && !twitterHandleRegExpr.test(identity.name)) {
        identityError.name = (
          <Trans
            id="contact.form.identity.not_twitter"
            values={{ name: identity.name }}
            defaults="The twitter username {name} is invalid. It should be between 1 or 15 characters with no special characters. For example «caliopen_org»."
          />
        );
        hasError = true;
      }

      return hasError ? identityError : undefined;
    }, []);

  if (identityErrors && identityErrors.length) {
    errors.identities = identityErrors;
  }

  return errors;
};
