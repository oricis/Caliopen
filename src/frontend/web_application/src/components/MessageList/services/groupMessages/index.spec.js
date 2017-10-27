import groupMessages from './';

describe('service MessageList groupMessages', () => {
  it('give an object with empty results', () => {
    expect(groupMessages([])).toEqual({});
  });

  it('give an object with 2 groups', () => {
    const messages = [
      { date_insert: '2017-01-03' },
      { date_insert: '2017-01-01' },
      { date_insert: '2017-01-01' },
    ];

    expect(groupMessages(messages)).toEqual({
      [(new Date(Date.UTC(2017, 0, 1))).toISOString()]: [messages[1], messages[2]],
      [(new Date(Date.UTC(2017, 0, 3))).toISOString()]: [messages[0]],
    });
  });

  it('add a group for today with full date using the first date', () => {
    const oneHourAgo = new Date();
    const twoHoursAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    const messages = [
      { date_insert: twoHoursAgo.toJSON() },
      { date_insert: oneHourAgo.toJSON() },
    ];

    expect(groupMessages(messages)).toEqual({
      [twoHoursAgo.toJSON()]: [
        messages[0], messages[1],
      ],
    });
  });
});
