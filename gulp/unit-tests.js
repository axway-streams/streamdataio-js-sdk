/**
 *
 *    Copyright 2015 streamdata.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var http = require("http");
var fs = require("fs");

var httpServer = http.createServer(function (req, res) {
  var interval;
  var fileName = "." + req.url;

  if (fileName === "./app/stocks/prices") {
    var origin = (req.headers.origin || "*");
    var i = 0;
    var price = Math.floor(Math.random() * (100 - 1) + 1);
    res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive", "Access-Control-Allow-Origin": "*"});

    res.write("event: snapshot\n");
    res.write("id: c9db1c53-bcb4-4b0b-ae30-ac91254ae44" + i + "\n");
    res.write("data: [{\"title\":\"Value 1\",\"price\":" + price + ",\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 2\",\"price\":89,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 3\",\"price\":63,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 4\",\"price\":11,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 5\",\"price\":30,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 6\",\"price\":20,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 7\",\"price\":65,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 8\",\"price\":97,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 9\",\"price\":4,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 10\",\"price\":43,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 11\",\"price\":7,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 12\",\"price\":27,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 13\",\"price\":51,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 14\",\"price\":38,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"},{\"title\":\"Value 15\",\"price\":16,\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"}]\n\n");
    res.write("retry: 10000\n");

    interval = setInterval(function() {
      i = i + 1;
      price = Math.floor(Math.random() * (100 - 1) + 1);
      res.write("event: snapshot\n");
      res.write("id: c9db1c53-bcb4-4b0b-ae30-ac91254ae44" + i + "\n");
      res.write("data: [{\"title\":\"Value 1\",\"price\":" + price + ",\"param1\":\"value1\",\"param2\":\"value2\",\"param3\":\"value3\",\"param4\":\"value4\",\"param5\":\"value5\",\"param6\":\"value6\",\"param7\":\"value7\",\"param8\":\"value8\"}]\n\n");
    }, 1000);
    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  } else {
    res.writeHead(404);
    res.end();
  }

});
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {

  httpServer.listen(1999, "127.0.0.1");

  karma.start({
    configFile: path.join(__dirname, '/../test/conf/karma.conf.js'),
    singleRun: true
  }, function(done){
    httpServer.close();
    process.exit(done);
  });

});
