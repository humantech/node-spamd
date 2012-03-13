# Spamd (SpamAssassin) client for node.js

This library use sockets to send a message to SpamAssassin daemon for evaluation.

Based on the SpamAssassin plugin from [Haraka](http://haraka.github.com/).

## Install from npm

	npm install node-spamd

## Usage

	var Spamd = require("node-spamd");
	var spamd  = new Spamd(sender, receiver, host, port);

	spamd.evaluate(subject, message, function(res, err){

		if(err) {
			console.log(err);
		} else {
			if(res.spam) {
				console.log('The message is Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
			}else{
				console.log('The message is not Spam, is evaluated with ' + res.evaluation + " points in a maximun of " + res.allowed);
			}
		}
	});

**sender**: Sender e-mail address/user. Default value: *root*
<br/>**receiver**: Receiver e-mail address/user. Default value: *root*
<br/>**host**: Spamd address. Default value: *localhost*
<br/>**port**: Spamd port. Default value: *783*
<br/>**subject**: String containing the message subject.
<br/>**message**: String containing the message body.

### Return value

The method returns an object, with the following attributes:

**spam** = **true** or **false**. Indicates the result of SpamAssassing analysis.
<br/>**evaluation** = Number or points or hits, that the message has obtained.
<br/>**allowed** = Configured minimal required points for SpamAssassin mark the message as SPAM. This is a spamd setting.

## TODO

* document source code;
* real documentation;
* jsHint standards.

## License

Copyright (C) 2012 Humantech

Distributed under the MIT License, the same as Node.js.
