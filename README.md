streamdata.io javascript sdk
============================
----------------------------


Introduction
============

This Javascript SDK facilitates the usage of streamdata.io.

<a href="http://streamdata.io" target="_blank">Streamdata.io</a> is a real-time data distribution platform that allows you to either poll a Rest API or push messages directly from your backend. Streamdata.io enables you to delegate the complexity of real-time data push while dramatically reducing bandwidth consumption through incremental data streaming.
Go beyond the traditional request/response mechanism and the limits that come with this approach.
Streamdata.io uses Server-Sent-Events in order to provide its push feature.
Instead of requesting data every time, the client subscribes to receive real-time updates coming from the server in an automated fashion.

## Features

* **Push**: Updates are pushed to the client using <a href="http://www.w3schools.com/html/html5_serversentevents.asp" target="_blank">Server-Sent Events</a> (SSE). By providing fallback mechanisms, Streamdata.io can also work with older browsers.
* **Incremental updates**: Replacing polling by push is not enough to minimize data streams. That's why Streamdata.io only pushes the part of data that has changed thanks to <a href="http://jsonpatch.com/" target="_blank">JSON Patch</a>.
* **Cache**: To reduce server load and latency, Streamdata.io relies on an In-memory Data Grid to efficiently cache data across its cluster.

Follow this quick start guide to easily integrate streamdata.io into your application.

Getting Started
===============

## 1. Get the SDK

### 1.1 Prerequisites

Having node.js and npm installed on your computer.

### 1.2 Option 1 : Build SDK from source

Then check out the project from git and simply run the following command lines to build the sdk file from source:

```
yarn install 
```
This will install npm components for the build.

```
yarn build
```
The result of this will be available in the dist/ folder :
  * dist/bundles
    * streamdataio.d.ts : typescript definition file
    * streamdataio-web.js and streamdataio-web.min.js : js files for web framework (plain, jquery, angular, vuejs)
    * streamdataio-node.js and streamdataio-node.min.js : js files for node.js 
  * dist/commonjs
    * SDK compile for commonjs target
  * dist/es6
    * SDK compile for es6 target
  * dist/src
    * Source files of typescript definition
  

### 1.3 Option 2 : install the SDK from npm

The streamdataio-js-sdk is available through a npm package.

You can install it through the following command line :

```
yarn install streamdataio-js-sdk
```

Or with NPM :

```
npm install streamdataio-js-sdk --save
```

Distribution files will be available in node_modules/streamdataio-js-sdk/dist/bundles folder. Use respectively streamdataio.min.js for Web environment or streamdataio-node.min.js for Node.Js environment

### 1.4 Option 3 : via CDN

streamdataio JS SDK is available via CDN at the following link :

```
https://cdn.rawgit.com/streamdataio/streamdataio-js-sdk/master/dist/bundles/streamdataio.min.js
```

This method must be used only for dev/testing purpose.

## 2. Add SDK to your application

Add reference to the streamdataio.min.js file in your application code. Usually this is done by using a script html tag into your main page:

```html
<script src="streamdataio.min.js"></script>
```

By doing this, you access in your JavaScript code to the ```streamdataio``` object which is the central point of all streamdata.io SDK API.


## 3. Use streamdata.io to connect to your API

### 3.1 Streamdata Proxy version 1

```/!\ DEPRECATED /!\ ``` This method has been deprecated since version 2.1.0 of this SDK.

Create a ```StreamdataEventSource``` object into your JavaScript code.

```javascript
    var myEvent = streamdataio.createEventSource("http://mysite.com/myRestService",<app_token>);
```

The ```StreamdataEventSource``` is the entry point for establishing a data stream connection to the given URL.

It uses an application **token** to identify and authorize the stream connection to be established.

To get a valid **token**, please visit <a href="http://streamdata.io" target="_blank">streamdata.io web site</a> to register and create an application.

It uses standard HTTP Server-Sent Events to get the data you required through streamdata.io proxy.

If your API requires specific headers, simply pass them as an array on the event source creation, and streamdata.io will forward them to your Information System.

An optional ```headers``` parameter can be passed to the ```createEventSource``` method.

It must be an array with the following structure:
```
['header1: headervalue1', 'header2: headervalue2']
```

Here is an example to add a Basic authorization header to your target API call:

```javascript

    // Your api URL
    var url = 'http://mysite.com/myJsonRestService';

    // add whatever header required by your API
    var headers = ['Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='];

    var myEventSource = streamdataio.createEventSource(url, <app_token>, headers);
```

### 3.1 Streamdata Proxy version 2

Depending on your needs, we will create either a ```StreamdataUrlSubscriber``` for auto-provisionning topic (like in v1)
 
```javascript
    var mySubscriber = streamdataio.subscribeToUrl("http://mysite.com/myRestService",<subscriber_key>);
```
 
or a ```StreamdataTopicSubscriber``` to subscribe to an existing topic using its id.

```javascript
    var mySubscriber = streamdataio.subscribeToTopic(<topic_id>, <subscriber_key>);
```

The ```StreamdataProxySubscriber``` is the entry point for establishing a data stream connection.

It uses an application **subscriber key** to identify and authorize the stream connection to be established.

To get a valid **subscriber key**, please visit <a href="http://streamdata.io" target="_blank">streamdata.io web site</a> to register and create an application.

It uses standard HTTP Server-Sent Events to get the data you required through streamdata.io proxy.

## 4. Handle data reception

streamdata.io SDK handles data from the targeted REST service as JSON objects.

When the ```EventSource``` object is opened, the initial set of data is returned as it would be with a standard call to the service URL. This data set is called the **snapshot**. The SDK returns it through the ```onData``` callback.

The updates of this initial set will come subsequently in the <a href="http://jsonpatch.com/" target="_blank">JSON-Patch</a> format through the ```onPatch``` callback. Such a data update is called a **patch**.

You can define your callback functions as follows:

```javascript
    mySubscriber.onData(function(data){
        // initialize your data with the initial snapshot
    }).onPatch(function(patch){
        // update the data with the provided patch
    }).onError(function(error){
        // do whatever you need in case of error
    }).onOpen(function(){
        // you can also add custom behavior when the stream is opened
    });
```

## 5. Start receiving data

```javascript
    mySubscriber.open();
```

Examples
========

## 1. Simple Javascript source code integration

Here is a complete example of how to use the different callbacks of the streamdata.io SDK.

You can copy/paste this piece of code in a HTML page and test it.

Each callback will be described in further details in the Public API JavaScript doc section.


```javascript
<!-- include streamdataio library -->
<script src="streamdataio.min.js" />

<!-- use json-patch-duplex library for applying patches -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/fast-json-patch/0.5.1/json-patch-duplex.min.js" />

<script>
(function() {
  var subscriber = null;
  var stocks = [];

  function connect() {
    // REPLACE WITH YOUR OWN SUBSCRIBER KEY HERE
    var subscriberKey = "NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1";

    // create the StreamdataEventSource Object
    subscriber = streamdataio.subscribeToUrl("http://myRestservice.com/stocks", subscriberKey);

    subscriber
     .onOpen(function() {
       console.log("streamdata Event Source connected.")
     })
     .onData(function(data) {
       // json object stored locally.
       stocks = data;
     })
     .onPatch(function(patch) {
       // use json patch library to apply the patch (patch)
       // to the original snapshot (stocks)
       jsonpatch.apply(stocks, patch);
     })
     .onError(function(error) {
       // displays the error message
       console.log(error.getMessage());
     });

    // open the data stream to the REST service through streamdata.io proxy
    subscriber.open();

  };

  function disconnect() {
    if (subscriber) {
      subscriber.close();
      subscriber = null;
    }
  };

  connect();
})();
</script>

```


## 2. Example projects

You'll find on GitHub the following projects which integrates streamdata.io SDK within simple example applications.

### 2.1 jQuery example

A simple jQuery integration of market data with streamdata.io SDK.

<a href="https://github.com/streamdataio/streamdataio-js/tree/master/stockmarket-jquery" target="_blank">Stock Market jQuery</a>

### 2.2 Angular.js example

The same market data example using Angular.js

<a href="https://github.com/streamdataio/streamdataio-js/tree/master/stockmarket-angular" target="_blank">Stock Market AngularJS</a>

### 2.3 Angular example

The same market data example using Angular

<a href="https://github.com/streamdataio/streamdataio-js/tree/master/stockmarket-angular2" target="_blank">Stock Market Angular</a>

### 2.4 VueJs example

The same market data example using VueJs

<a href="https://github.com/streamdataio/streamdataio-js/tree/master/stockmarket-vuejs" target="_blank">Stock Market VueJs</a>

### 2.4 Node.js example

The same market data example using node.js

<a href="https://github.com/streamdataio/streamdataio-js/tree/master/stockmarket-nodejs" target="_blank">Stock Market Node.js</a>


Security
========

## 1. TLS Encryption

streamdata.io proxy uses Transport Layer Security (TLS) as a default to encrypt messages while in transport across the Internet.

**Recommendation**:

Even if streamdata.io proxy can be used without TLS encryption, we strongly recommend to always use https (thus TLS) with applications using streamdata.io.

Using TLS ensures that client messages are protected when being sent to and from streamdata.io. This prevents intercepted messages from being viewed by unauthorized parties.

## 2. Authentication with Token

Running an application in production through streamdata.io proxy requires an authentication mechanism.

When registering on <a href="http://streamdata.io" target="_blank">streamdata.io web site</a>, you'll be provided with a unique **subscriber key** for your application and a **private key**.

This allows streamdata.io proxy to identify that a specific request comes from your application.

This **subscriber key** must be provided to the SDK in order to be able to use the streamdata.io proxy.

```javascript
    var subscriberKey = "NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1";
    var subscriber = streamdataio.subscribeToUrl("http://myRestservice.com/stocks", subscriberKey);
```

## 3. Authentication with signature

```/!\ NOT SUPPORTED IN V2 /!\ ```

streamdata.io SDK offers an optional Hash-based Message Authentication (HMAC) mechanism to enhance your requests security.

In order to use it, you'll first need to add streamdataio_auth javascript auth library to your project :


```html
<script src="/js/streamdataio-auth.min.js"></script>
```

This auth javascript library is available :

- in the github projet https://github.com/streamdataio/streamdataio-js

- via npm through the following command line :
```html
npm install streamdataio-js-sdk-auth
```

You can then use a signatureStrategy object when creating your StreamdataEventSource as follow:


```javascript
    // setup headers
    var headers = [];
    // setup signatureStrategy
    var signatureStrategy = AuthStrategy.newSignatureStrategy("NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1","NTEtMTQxNiWIzMDEC00OWNlLThmNGYtY2ExMDJxO00NzNhLTgtZWY0MjOTc2YmUxODFiZDU1NmU0ZDAtYWU5NjYxMGYzNDdi");
    // instantiate an eventSource
    var eventSource = streamdataio.createEventSource("http://myRestservice.com/stocks","NmEtYTljN2UtYmM1MGZlMGRiNGFQzYS00MGRkLTkNTZlMDY1", headers, signatureStrategy);
```


**Important Note**:

Your signatureStrategy is built using your **token** and **private key**.

The signatureStrategy will generate a signature specific to your data stream connection request.

This signature will be validated by streamdata.io proxy before authorizing your request to go through it.

**Your private key must be kept secret**.

Compression
========

Server-Sent event flow can be compressed on demand using **gzip** or **deflate** methods.

To do so, you can use the X-Sd-Compress header this way:

```javascript
X-Sd-Compress: true
```
If this header is not provided, the default behavior is NOT to use compression.
