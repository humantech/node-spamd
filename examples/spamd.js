var Spamd = require("node-spamd"),
	spamd  = new Spamd(sender, receiver, host, port);

spamd.evaluate(subject, message, function(res, err){
	if (err) {
		console.log(err);
	} else {
		if (res.spam) {
			console.log('The message is Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
		} else {
			console.log('The message is not Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
		}
	}
});
