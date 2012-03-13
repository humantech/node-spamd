var assert = require('assert'),
    vows = require('vows'),
    spamd = require("../lib/spamd");

var host = 'localhost',
    port = 783;

var sender = 'from@yourdomain.com',
    receiver = 'to@anotherdomain.com';

var Spamd  = new spamd(sender, receiver, host, port);

var spamSubject = 'Viagra, Cialis, Vicodin: buy medicines without prescription! CHEAPEST PRICE!',
    spamMessage = 'Cheap prices on viagra, cialis, vicodin! FPA approved! High quality is guaranteed!\n\rGet your medicine without prescription, online! Loose weight, gain strenght.\n\r\n\rWord at home and get a lot of money! See it for yourself!\n\rThis message is not a spam.\n\rTake a look at my pictures! Your forgot it on my cellphone.\n\r<a href="http://moxpage.info/get-paid-taking-surveys.html">Visit your Yahoo Group now</a>';

var cleanSubject = 'Test',
    cleanMessage = 'This is a test message.\r\n';

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
				}, 2000);				 
			},
			'Message should be marked as SPAM': function(response, error) {
				assert.equal(response.spam, true);
			}
		}
	}
}).export(module);
