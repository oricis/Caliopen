import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, withI18n } from 'lingui-react';
import { Link, Title, Button, Modal } from '../../components';
import './style.scss';

const URL_DEVICES = '/settings/devices';
const MODAL_CONTENT = 'Illud tamen te esse admonitum volo, primum ut qualis es talem te esse omnes existiment ut, quantum a rerum turpitudine abes, tantum te a verborum libertate seiungas; deinde ut ea in alterum ne dicas, quae cum tibi falso responsa sint, erubescas. Quis est enim, cui via ista non pateat, qui isti aetati atque etiam isti dignitati non possit quam velit petulanter, etiamsi sine ulla suspicione, at non sine argumento male dicere? Sed istarum partium culpa est eorum, qui te agere voluerunt; laus pudoris tui, quod ea te invitum dicere videbamus, ingenii, quod ornate politeque dixisti.';

@withI18n()
class NewDeviceInfo extends PureComponent {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };

state = {
  isModalOpen: false,
};

handleOpenModal = () => {
  this.setState({
    isModalOpen: true,
  });
};

handleCloseModal = () => {
  this.setState({
    isModalOpen: false,
  });
};

renderModal = () => {
  const { i18n } = this.props;

  return (
    <Modal
      isOpen={this.state.isModalOpen}
      className="s-new-device-info__modal"
      title={i18n._('new-device-info.modal.title', { defaults: 'About new device' })}
      onClose={this.handleCloseModal}
    >
      {MODAL_CONTENT}
    </Modal>
  );
}

render() {
  return (
    <div className="s-new-device-info">
      <Title className="s-new-device-info__title">
        <Trans id="new-device-info.title">It s the first time you attemp to connect to your Caliopen account on this client.</Trans>
      </Title>
      <Trans id="new-device-info.text">To respect privacy and security rules, your discussion history will not appear here for now. Please verify this device and eventually set restrictions from your trust client to use Caliopen on this client.</Trans>

      <div className="s-new-device-info__actions">
        <Button
          onClick={this.handleOpenModal}
          className="s-new-device-info__learn-more"
        >
          <Trans id="new-device-info.learn-more">Learn more</Trans>
        </Button>
        {this.renderModal()}
        <Link
          plain
          button
          to={URL_DEVICES}
        >
          <Trans id="new-device-info.i-understand">I understand</Trans>
        </Link>
      </div>
    </div>
  );
}
}

export default NewDeviceInfo;
