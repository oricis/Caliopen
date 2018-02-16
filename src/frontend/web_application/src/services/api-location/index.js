import getClient from '../api-client';

export default function fetchLocation(location) {
  return getClient().get(location);
}
