import {DefaultStreamDataProxyURL, DefaultStreamDataProxyVervion, LegacyStreamDataProxy} from './proxy.config';

describe('ProxyConfig', () => {

  it('should have a default StreamData proxy URL', () => {
    expect(DefaultStreamDataProxyURL.toString()).toEqual('https://proxy.streamdata.io/');
  });

  it('should have a default StreamData proxy version', () => {
    expect(DefaultStreamDataProxyVervion).toEqual('v1');
  });

  it('should have a legacy StreamData proxy URL', () => {
    expect(LegacyStreamDataProxy.toString()).toEqual('https://streamdata.motwin.net/');
  });
});
