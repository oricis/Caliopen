export const toggleMarkAsReadHandler = ctx => () => {
  const { message, onMessageRead, onMessageUnread } = ctx.props;

  if (message.is_unread) {
    onMessageRead({ message });
  } else {
    onMessageUnread({ message });
  }
};
