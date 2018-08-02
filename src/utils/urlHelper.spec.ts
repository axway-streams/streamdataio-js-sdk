import {UrlHelper} from 'utils/urlHelper';
describe('UrlHelper', function () {

  describe('urlToString', function () {

    it('should return a url from protocol and host', function () {
      let urlToString = UrlHelper.urlToString('http', 'www.test.com');
      let urlExpected = 'http://www.test.com';

      expect(urlToString).toEqual(urlExpected);
    });

    it('should return a url from protocol, host and port', function () {

      let urlToString = UrlHelper.urlToString('http', 'www.test.com', 800);
      let urlExpected = 'http://www.test.com:800';

      expect(urlToString).toEqual(urlExpected);
    });
  });

});
