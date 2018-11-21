export const ASSOC_PROTOCOL_ICON = {
  email: 'envelope',
  twitter: 'twitter',
  unknown: 'question-circle',
};

export default {
  unknown: {
    default: true,
  },
  sms: {
  },
  email: {
    regexp: /^[a-z0-9.!#$%&*+=?_{}~-]+@([a-z0-9]+\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,60}$/,
  },
  twitter: {
    regexp: /^@\w{1,15}$/,
  },
  facebook: {
  },
};
