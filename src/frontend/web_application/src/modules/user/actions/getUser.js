import { tryCatchAxiosAction } from '../../../services/api-client';
import { requestUser } from '../../../store/modules/user';
import { userSelector } from '../selectors/userSelector';

export const getUser = () => async (dispatch, getState) => {
  let user = userSelector(getState());

  if (user) {
    return user;
  }

  const response = await tryCatchAxiosAction(() =>
    dispatch(requestUser()));
  [user] = response.messages;

  return user;
};
