import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/react';
import { Button, VerticalMenuItem } from '../../../../components';
import { withNotification } from '../../../../modules/userNotify';
import { InstallPromptConsumer } from '../../../../modules/pwa';

const InstallButton = ({ notifySuccess }) => (
  <InstallPromptConsumer
    render={(defferedPrompt) => {
      if (!defferedPrompt) {
        return null;
      }

      const handleInstall = async () => {
        defferedPrompt.prompt();
        const { outcome } = await defferedPrompt.userChoice;

        if (outcome === 'accepted') {
          notifySuccess({
            message: (<Trans id="pwa.feedback.install-success">Caliopen has been installed on your device.</Trans>),
          });
        }
      };

      return (
        <VerticalMenuItem>
          <Button display="expanded" center={false} onClick={handleInstall}>
            <Trans id="pwa.action.install">Install</Trans>
          </Button>
        </VerticalMenuItem>
      );
    }}
  />
);

InstallButton.propTypes = {
  notifySuccess: PropTypes.func.isRequired,
};
InstallButton.defaultProps = {
};

export default withNotification()(InstallButton);
