var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

console.log(__dirname + '/');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.configure(function() {
    app.use(allowCrossDomain);
    app.use(express.static(__dirname + '/'));

});
app.get('/', function(req, res){
    res.redirect('index.html');
});

server.listen(8080,'127.0.0.1',function(){
    console.log("listening on 8080")
});
