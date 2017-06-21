import {StreamDataUrl} from './streamDataUrl';
import {StreamDataServer} from './streamDataServer';
describe('StreamDataServer', function () {

  describe('Constructor', function () {
    it('should create a url with no port', function () {
      let streamDataServer = new StreamDataServer('http', 'www.here.fr');
      let expectedUrl = 'http://www.here.fr';

      expect(streamDataServer.toString()).toEqual(expectedUrl);
    });

    it('should create a url with port', function () {
      let streamDataServer = new StreamDataServer('http', 'www.there.fr', '80');
      let expectedUrl = 'http://www.there.fr:80';

      expect(streamDataServer.toString()).toEqual(expectedUrl);
    });

  });

  describe('getFullUrl', function () {
    it('should return a url with server and client part', function () {
      let streamDataServer = new StreamDataServer('http', 'www.here.fr');
      let streamDataUrl = new StreamDataUrl('http://www.there.fr', 'someRandomExtraLongDummyToken');
      let expectedConvertedUrl = 'http://www.here.fr/http://www.there.fr?X-Sd-Token=someRandomExtraLongDummyToken';
      let convertedUrl = streamDataServer.getFullUrl(streamDataUrl);

      expect(convertedUrl).toEqual(expectedConvertedUrl);
    });

    it('should return a url with server and client part with param', function () {
      let streamDataServer = new StreamDataServer('http', 'www.here.fr');
      let streamDataUrl = new StreamDataUrl('http://www.there.fr?toto=1', 'someRandomExtraLongDummyToken');
      let expectedConvertedUrl = 'http://www.here.fr/http://www.there.fr?toto=1&X-Sd-Token=someRandomExtraLongDummyToken';
      let convertedUrl = streamDataServer.getFullUrl(streamDataUrl);
      expect(convertedUrl).toEqual(expectedConvertedUrl);
    });

  });
});
