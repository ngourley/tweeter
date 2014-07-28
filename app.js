var   config  = require('./config')
    , winston = require('winston')
    , http    = require('http')
    , express = require('express')
    , path    = require('path')
    , routes  = require('./routes')
    , app, server, io, port;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.winston);

app = express();
server = http.createServer(app);
io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// io.set('log level', 1);
io.sockets.on('connection', require('./sockets'));

port = process.env.PORT || 3000;

server.listen(port, function() {
    winston.info('Express listening on ' + port);
});


// bot.retweetTopic('#angularjs', function (err, data) {
//     console.log(err)
//     console.log(data)
// });

// bot.retweetRandom(function (err, data) {
//     console.log(err);
//     console.log(data);
// });

// bot.printMyTweets(function(err, tweets) {})
// bot.untweet({id_str:'490275390292631552'}, function(err, data){
//     console.log(err)
// })

// bot.mingleLikelyToFollow(function (err, user) {
//     if (err) return winston.error(err);
//     console.log('Now following @' + user.screen_name);
// });
// setInterval(function(){
//     bot.mingleLikelyToFollow(function (err, user) {
//         if (err) return winston.error(err);
//         console.log('Now following @' + user.screen_name);
//     });
// }, moment.duration(20, 'minutes'));

