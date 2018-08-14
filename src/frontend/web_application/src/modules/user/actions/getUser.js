import { tryCatchAxiosAction } from '../../../services/api-client';
import { requestUser } from '../../../store/modules/user';
import { userSelector } from '../selectors/userSelector';

export const getUser = () => async (dispatch, getState) => {
  const user = userSelector(getState());

  if (user) {
    return user;
  }

  return tryCatchAxiosAction(() => dispatch(requestUser()));
};
