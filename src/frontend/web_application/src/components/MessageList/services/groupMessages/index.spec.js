import groupMessages from './';

describe('service MessageList groupMessages', () => {
  it('give an object with empty results', () => {
    expect(groupMessages([])).toEqual({});
  });

  it('give an object with 2 groups', () => {
    const messages = [
      { date_received: (new Date()).toJSON() },
      { date_received: '2017-01-01' },
      { date_received: '2017-01-01' },
    ];

    expect(groupMessages(messages)).toEqual({
      [(new Date(messages[1].date_received)).toDateString()]: [messages[1], messages[2]],
      [(new Date(messages[0].date_received)).toDateString()]: [messages[0]],
    });
  });
});
