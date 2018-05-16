import { getSignatureHeaders } from './';

jest.mock('../storage', () => ({
  getConfig: () => ({
    id: 'THIS-IS-NOT-A-DEVICE',
    priv: '34CFFE35A6EC3B494A304E30C68852D92607BD04533DB5FE4E3B2443F08B95CF',
  }),
}));

describe('HTTP Request signature headers', () => {
  it('Creates a signature from URL', async () => {
    const req = { method: 'get', url: '/run/to/the/hills' };

    const signatureHeaders = await getSignatureHeaders(req);
    expect(signatureHeaders).toEqual({
      'X-Caliopen-Device-ID': 'THIS-IS-NOT-A-DEVICE',
      'X-Caliopen-Device-Signature': 'MEUCIQDNgJ+t7BjbOtwd2no6BgEDF4OsnsVjupRKx4nRDIGUBgIgcLvIz+WLb8bPn7yFI4VLgvtytmDrlwYAc1FD5B7XX0I=',
    });
  });

  it('Creates a signature from URL + params', async () => {
    const req = {
      method: 'get',
      url: '/run',
      params: {
        to: 'the hills',
        for: 'your life',
      },
    };

    const signatureHeaders = await getSignatureHeaders(req);
    expect(signatureHeaders).toEqual({
      'X-Caliopen-Device-ID': 'THIS-IS-NOT-A-DEVICE',
      'X-Caliopen-Device-Signature': 'MEYCIQD7Twl3Zg27BuOt8x0itN/gAX9o9els3hr+i5Oj+36khwIhANpmhM5gJcYfLd0vvd1PObuuisYvZOVEFAokzUR/wz9F',
    });
  });

  it('Creates a signature from URL + file', async () => {
    const file = new Blob([0x4D, 0x65, 0x72, 0x64, 0x65, 0x20, 0x1F, 0x20, 0x63,
      0x65, 0x6C, 0x75, 0x69, 0x20, 0x71, 0x75, 0x69, 0x20, 0x6C, 0x69, 0x72, 0x61, 0x2E]);
    const req = {
      method: 'post',
      url: '/run',
      data: file,
    };

    const signatureHeaders = await getSignatureHeaders(req);
    expect(signatureHeaders).toEqual({
      'X-Caliopen-Device-ID': 'THIS-IS-NOT-A-DEVICE',
      'X-Caliopen-Device-Signature': 'MEUCIHdRNRizgmKt2Hdjpm3FUX6KNyTL/DKID6plbv5UZFbtAiEA5dcum6WhboPW5jd6L3gOP2Gh8mnKUroHbZrj/0Tz8pQ=',
    });
  });
});
