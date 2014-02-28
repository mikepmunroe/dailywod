var FeedParser = require('feedparser'),
  request = require('request'),
  result = [];

var feed = 'http://www.crossfitwicked.com/feeds/rss_3.xml';

var req = request(feed, {timeout: 10000, pool: false});
req.setMaxListeners(50);

// Some feeds do not respond without user-agent and accept headers.
req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
   .setHeader('accept', 'text/html,application/xhtml+xml');

var feedparser = new FeedParser();

req.on('error', done);
req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});


feedparser.on('error', done);
feedparser.on('end', done);
feedparser.on('readable', function() {
  while (item = this.read()) {
    result.push({title: item.title, wod: item.description});
  }
});

function done(err) {
  if (err) {
    console.log(err, err.stack);
    return process.exit(1);
  }
  console.log(result);
  return done(result);
  process.exit();
}
