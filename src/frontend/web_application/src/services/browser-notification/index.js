export const PERMISSION_GRANTED = 'granted';
export const PERMISSION_DENIED = 'denied';

export const isSupported = typeof window !== 'undefined' && 'Notification' in window;

export default isSupported && window.Notification;
