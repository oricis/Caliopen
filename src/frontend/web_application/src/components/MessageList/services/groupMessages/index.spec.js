import groupMessages from './';

describe('service MessageList groupMessages', () => {
  it('give an object with empty results', () => {
    expect(groupMessages([])).toEqual({});
  });

  it('give an object with 2 groups', () => {
    const now = new Date();
    const messages = [
      { date: now.toJSON() },
      { date: '2017-01-01' },
      { date: '2017-01-01' },
    ];

    expect(groupMessages(messages)).toEqual({
      [(new Date(Date.UTC(2017, 0, 1))).toISOString()]: [messages[1], messages[2]],
      [(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))).toISOString()]: [
        messages[0],
      ],
    });
  });
});
