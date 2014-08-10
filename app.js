var   config  = require('./config')
    , winston = require('winston')
    , http    = require('http')
    , express = require('express')
    , path    = require('path')
    , routes  = require('./routes')
    , app, server, io, port;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.winston);

require('./database');
require('./automation');

app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

io.sockets.on('connection', require('./communication'));

port = process.env.PORT || 3000;

server.listen(port, function() {
    winston.info('Express listening on ' + port);
});