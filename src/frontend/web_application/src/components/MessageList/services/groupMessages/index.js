const groupMessages = messages => [...messages]
  .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  .reduce((acc, message) => {
    const datetime = new Date(message.date);
    const date = (new Date(Date.UTC(
      datetime.getFullYear(), datetime.getMonth(), datetime.getDate()
    ))).toISOString();
    const accMessages = acc[date] || [];

    return {
      ...acc,
      [date]: [
        ...accMessages,
        message,
      ],
    };
  }, {});

export default groupMessages;
