var request = require('request'),
  FeedParser = require('feedparser'),
  moment = require('moment'),
  mongoose = require('mongoose'),
  db = mongoose.connect('mongodb://localhost/dailywod');

var WodSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    description: String,
    guid: String
  });

var Wod = mongoose.model('Wod', WodSchema);

var feed = 'http://www.crossfitwicked.com/feeds/rss_3.xml';
fetch(feed);

function fetch(feed) {
  var req = request(feed, {timeout: 10000, pool: false});
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
     .setHeader('accept', 'text/html,application/xhtml+xml');

  var feedparser = new FeedParser();

  req.on('error', done);
  req.on('response', function(res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', done);
  feedparser.on('end', done);
  feedparser.on('readable', function() {
    var post;
    while (post = this.read()) {
      saveContent(post);
    }
  });
}

function saveContent(content) {
  if (content.pubdate > moment) {
    content = scrubContent(content)
    var wod = new Wod({ date: content.title, description: content.description, guid: content.guid });
    wod.save(function (err) {
      if (err && err.errors && err.errors.guid && err.errors.guid.type==='unique') { console.log('>> article already saved'); return; }
    });
  }
}

function done(err) {
  if (err) {
    console.log(err, err.stack);
    return process.exit(1);
  }
  process.exit();
}

function scrubContent(content) {
  content.title = content.title.replace(/(<([^>]+)>)/ig,"");
  content.description = content.description.replace( "/\n/g", " ");
  content.description = content.description.replace( "&nbsp;", "");
  content.description = content.description.replace(/(<([^>]+)>)/ig,"");
  strings = content.description.split(["\n"]);
  strings.every(nonDate);
  content.description = strings.join(' ');
  return content;
}

function nonDate(element, index, array) {
  if(moment(element).isValid()) {
    return array.splice(index, 1);
  }
}