var Spamd = require("../lib/spamd");
var spamd  = new Spamd('from@yourdomain.com', 'to@anotherdomain.com', 'localhost', 783);

var subject = 'Test Subject';
var message = 'test content.';

spamd.evaluate(subject, message, function(res, err){

	if(typeof res.spam !== 'undefined'){
		if(res.spam){
			console.log('The message is Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
		}else{
			console.log('The message is not Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
		}
	}else{
		console.log(err);
	}

});
