
'use strict';

describe('StreamdataEventSource.', function () {

  describe('CheckDecorateDecoratesURLs with Authentication', function() {

      beforeEach(function() {

      });

    it('should add authparams to url when auth is activated', function () {
      //GIVEN
      var appToken = "ZWZiNzlhYTItYjA5MC00YWMwLWE2NTQtYmNmZmJiNDkyZGYz";
      var pk = "MmIyMzBlZGMtOGYyNi00OGY2LWI2YTYtZmY1OTFlMzY1NjNiYjNhMzc3NWMtMzMwMC00YmMzLWI0NGYtMmM1ZmU4MDAzMGFh";

      var strategy = AuthStrategy.newSignatureStrategy(appToken,pk);

      var e = new StreamdataEventSource("http://www.google.fr", appToken, [], strategy);

      var convertedUrl = e._decorate(e._url);

      var parser = document.createElement('a');
      parser.href = convertedUrl;

      expect(parser.search).toContain("X-Sd-Token=" + appToken);
      expect(parser.search).toContain("X-Auth-Sd-S=");
      expect(parser.search).toContain("X-Auth-Sd-Ts=");
      expect(parser.pathname).toEqual("/http://www.google.fr/");

    });


    it('should concat header and auth params to url when auth is activated', function () {
      //GIVEN
      var appToken = 'ZWZiNzlhYTItYjA5MC00YWMwLWE2NTQtYmNmZmJiNDkyZGYz';
      var pk = "MmIyMzBlZGMtOGYyNi00OGY2LWI2YTYtZmY1OTFlMzY1NjNiYjNhMzc3NWMtMzMwMC00YmMzLWI0NGYtMmM1ZmU4MDAzMGFh";
      var headers = ['toto:1', 'tutu:2'];

      var strategy = AuthStrategy.newSignatureStrategy(appToken,pk);

      var e = new StreamdataEventSource('http://www.google.fr', appToken, headers, strategy);

      var convertedUrl = e._decorate(e._url,e._headers);

      var parser = document.createElement('a');
      parser.href = convertedUrl;

      expect(parser.search).toContain("X-Sd-Token=" + appToken);
      expect(parser.search).toContain("X-Auth-Sd-S=");
      expect(parser.search).toContain("X-Auth-Sd-Ts=");
      expect(parser.search).toContain("X-Sd-Header=toto%3A1&X-Sd-Header=tutu%3A2");
      expect(parser.pathname).toEqual("/http://www.google.fr/");

    });

  });
});
