import { getNextNotifications } from './getNextNotifications';

describe('notification - getNextNotifications', () => {
  it('has common', () => {
    const prev = [
      {
        emitter: 'lmtp',
        body: 'A',
        timestamp: 100000000,
        notif_id: 'aaaa-bbbb-0001',
      },
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
    ];
    const last = [
      {
        emitter: 'lmtp',
        body: 'A',
        timestamp: 100000000,
        notif_id: 'aaaa-bbbb-0001',
      },
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
    ];

    expect(getNextNotifications(last, prev)).toEqual([...last]);
  });

  it('has no more notifs but still present', () => {
    const prev = [
      {
        emitter: 'lmtp',
        body: 'A',
        timestamp: 100000000,
        notif_id: 'aaaa-bbbb-0001',
      },
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
    ];
    const last = [];

    expect(getNextNotifications(last, prev)).toEqual([...prev]);
  });

  it('has new notifs', () => {
    const prev = [];
    const last = [
      {
        emitter: 'lmtp',
        body: 'A',
        timestamp: 100000000,
        notif_id: 'aaaa-bbbb-0001',
      },
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
    ];

    expect(getNextNotifications(last, prev)).toEqual([...last]);
  });

  it('has mixed new & old & common notifs', () => {
    const prev = [
      {
        emitter: 'lmtp',
        body: 'A',
        timestamp: 100000000,
        notif_id: 'aaaa-bbbb-0001',
      },
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
    ];
    const last = [
      {
        emitter: 'lmtp',
        body: 'B',
        timestamp: 100000001,
        notif_id: 'aaaa-bbbb-0002',
      },
      {
        emitter: 'lmtp',
        body: 'C',
        timestamp: 100000010,
        notif_id: 'aaaa-bbbb-0003',
      },
    ];

    expect(getNextNotifications(last, prev)).toEqual([
      ...prev,
      {
        emitter: 'lmtp',
        body: 'C',
        timestamp: 100000010,
        notif_id: 'aaaa-bbbb-0003',
      },
    ]);
  });

  it('has no notifs', () => {
    const prev = [];
    const last = [];

    expect(getNextNotifications(last, prev)).toEqual([]);
  });
});
