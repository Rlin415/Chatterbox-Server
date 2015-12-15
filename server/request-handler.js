var storage = [];
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "Content-Type": "application/json",
  "access-control-max-age": 10 // Seconds.
};
var selectMsg = function(routes) {
  var results;
  if(routes[1] !== 'messages' && routes[1] !== 'lobby'){
    results =  [];
    storage.forEach(function(message){
      if(message.roomname === routes[1]){
        results.push(message);
      }
    });
  }else{
    results = storage;
  }
  return results;
};


exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var routes = request.url.split('/').slice(1);
  if (routes[0] === "classes" && request.method === "GET") {
    var results = selectMsg(routes);
    response.writeHead(200, headers);
    response.end(JSON.stringify({'results': results}));
  } else if (routes[0] === "classes" && request.method === "OPTIONS") {
    response.writeHead(200, headers);
    response.end();
  } else if (routes[0] === "classes" && request.method === "POST") {
    var body = "";
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function(data){
      response.writeHead(201, headers);
      storage.push(JSON.parse(body));
      response.end(JSON.stringify(storage));
    });
  } else {
    response.writeHead(404, headers);
    response.end();
  }

};
