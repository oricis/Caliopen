export const replyHandler = ctx => () => {
  const { onReply, message, push } = ctx.props;
  onReply({ message });
  push({ hash: 'reply' });
};
