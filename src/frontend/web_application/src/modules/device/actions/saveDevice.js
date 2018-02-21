import { createDevice, updateDevice, invalidate, requestDevice } from '../../../store/modules/device';

export const saveDevice = ({ device, original }) => async (dispatch) => {
  if (!original) {
    await dispatch(createDevice({ device }));
    dispatch(invalidate());

    return dispatch(requestDevice({ deviceId: device.device_id }));
  }

  return dispatch(updateDevice({ device, original }));
};
