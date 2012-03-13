var assert = require('assert'),
    vows = require('vows'),
    spamd = require("../lib/spamd");

var host = '10.1.1.3';
var port = 783;

var sender = 'guilherme@humantech.com.br';
var receiver = 'thomas@humantech.com.br';

var Spamd  = new spamd(sender, receiver, host, port);

var spamSubject = 'Buy Cialis, viagra';
var spamMessage = 'enlarge your penis\r\n boobs\r\n meet sexy teens tonight! \r\n';

var cleanSubject = 'Test';
var cleanMessage = 'This is a test message.\r\n';

vows.describe('node-spamd').addBatch({
	'Validating' : {
		'Detecting valid messages' : {
			topic: function() {
				Spamd.evaluate(cleanSubject, cleanMessage, this.callback);
			},
			'Message should not be SPAM': function(response, error) {
				assert.equal(response.spam, false);
			}
		},
		'Detecting spam messages' : {
			topic: function() { 
				var self = this;
				setTimeout(function(){
					Spamd.evaluate(spamSubject, spamMessage, self.callback);
				}, 1000);				 
			},
			'Message should be marked as SPAM': function(response, error) {
				assert.equal(response.spam, true);
			}
		}
	}
}).export(module);