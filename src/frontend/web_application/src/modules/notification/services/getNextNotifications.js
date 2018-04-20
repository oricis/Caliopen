export const getNextNotifications = (last, prev) => {
  const knownNotifIds = new Set(prev.map(notif => notif.notif_id));
  const toAdd = last.filter(notif => !knownNotifIds.has(notif.notif_id));

  return [
    ...prev,
    ...toAdd,
  ];
};
