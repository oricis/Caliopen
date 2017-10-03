import withSettings, { settingsSelector } from './withSettings';

function getDefaultSettings(locale) {
  return {
    default_locale: locale,
    message_display_format: 'rich_text',
    contact_display_format: 'given_name, family_name',
    contact_display_order: 'given_name',
    notification_enabled: true,
    notification_message_preview: 'always',
    notification_sound_enabled: false,
    notification_delay_disappear: 10,
    notification_delay_disappear_unit: 's',
  };
}

export { getDefaultSettings, withSettings, settingsSelector };
