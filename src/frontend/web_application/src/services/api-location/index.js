import getClient from '../api-client';

export function normalizeLocation(location) {
  return location.replace(/^\/api/, '');
}

export default function fetchLocation(location) {
  return getClient().get(normalizeLocation(location));
}
