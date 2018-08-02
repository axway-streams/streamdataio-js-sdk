import {StreamDataUrl} from 'sse/streamDataUrl';
describe('StreamDataUrl', function () {

  it('should decorate a simple url with no params', function () {
    let streamDataUrl = new StreamDataUrl('http://www.google.fr', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://www.google.fr?X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();

    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });

  it('should decorate a url with params', function () {
    let streamDataUrl = new StreamDataUrl('http://www.google.fr?toto=1', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://www.google.fr?toto=1&X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();
    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });

  it('should decorate a url with userinfo', function () {
    let streamDataUrl = new StreamDataUrl('http://john:doe@www.google.fr?toto=1', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://john:doe@www.google.fr?toto=1&X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();
    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });

  it('should decorate a url with userinfo and query param with @', function () {

    let streamDataUrl = new StreamDataUrl('http://john:doe@www.faroo.com/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://john:doe@www.faroo.com/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_&X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();
    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });

  it('should decorate a url with params that contains an @', function () {

    let streamDataUrl = new StreamDataUrl('http://www.faroo.com/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://www.faroo.com/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_&X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();
    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });

  it('should decorate a url with port', function () {

    let streamDataUrl = new StreamDataUrl('http://www.toto.com:3009/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_', 'someRandomExtraLongDummyToken');
    let expectedConvertedUrl = 'http://www.toto.com:3009/api?q=knicks&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@SAjQd6OVhqY_&X-Sd-Token=someRandomExtraLongDummyToken';
    let convertedUrl = streamDataUrl.toString();
    expect(convertedUrl).toEqual(expectedConvertedUrl);
  });
});
