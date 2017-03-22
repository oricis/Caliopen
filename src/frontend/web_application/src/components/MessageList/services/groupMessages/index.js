const groupMessages = messages => [...messages]
  .sort((a, b) => Date.parse(a.date_received) - Date.parse(b.date_received))
  .reduce((acc, message) => {
    const date = (new Date(message.date_received)).toDateString();
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
