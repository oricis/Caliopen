export const messageDeleteHandler = ctx => () => {
  const { message, onMessageDelete } = ctx.props;

  onMessageDelete({ message });
};
