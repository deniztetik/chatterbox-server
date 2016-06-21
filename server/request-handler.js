/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// var qs = require('querystring');
var _ = require('underscore');
var results = require('./data.js').results;
var rooms = require('./data.js').rooms;
var fs = require('fs');
var $ = require('jQuery');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder ('utf8');
var events = require('events');
var eventEmitter = new events.EventEmitter();


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  var getAndSendFile = function(path, contentType) {
    var content = '';
    fs.readFile(path, (err, data) => {
      if (err) {
        console.error('error!');
      }
      content += data;
        response.writeHead(200, {'Content-Type': contentType});
        response.end(content);
      // });
    });
  }

  if(request.method == 'GET') {
    var data = {
      results: []
    };
    var path = '';
    var route = request.url.split('/');
    route.shift();
    var currentLocation = route.shift();
    console.log('current location is: ', currentLocation);
    // console.l
    if (request.url === '/') {
      path = 'client/index.html';
      getAndSendFile(path, 'text/html');
    } else if (request.url === '/?createdAt=-createdAt') {

      console.log('GET request to "classes."')
      data.results = results;
      var validUrl = request.url.split('/');

      // if (validUrl[1] !== 'classes') {
      //   statusCode = 404;
      // }

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(data));
    } else if (currentLocation !== 'classes') {
      path = __dirname.split('/');
      path.pop();
      path = path.join('/');
      path += '/client' + request.url;
      console.log('After all of this stupid shit, our path is:  ', path);
      console.log(route);
      if (route.length > 0) {
        var fileType = route.pop().split('.');
        fileType = fileType.pop();
      }

      if (fileType === 'css') {
        getAndSendFile(path, 'text/css');
      } else if (fileType === 'js') {
        getAndSendFile(path, 'text/javascript')
      }

    } else {
      statusCode = 404;
      response.end();
    }
  }


  if(request.method == 'POST') {
    var room = request.url.split('/')[2];
    if (!_.contains(rooms, room)) {
      rooms.push(room);
    }
    statusCode = 201;
    var body = '';
    request.on('data', function(data) {
      body += data;
    });
    console.log(body);
    request.on('end', function(data) {
      data = JSON.parse(body);
      if (!data.username) {
        data.username = 'Anon';
      }
      results.push(data);
      response.end();
    });
  }
};

