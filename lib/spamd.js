var net = require('net');

var Spamd = (function(){
    
	var _headers = '';
	var _sender = 'root';
	var _receiver = 'root';
	var _host = 'localhost';
	var _port = 783;
	
	var _instance = null;
	var _evaluate = {};
	var _fn = null;

    var Constructor = function(sender, receiver, host, port) {
        
    	if(typeof sender !== 'undefined' && 
    	   typeof receiver !== 'undefined'){
    		
    		_sender = sender;
       		_receiver = receiver;

       		if(typeof host !== 'undefined'){
        		_host = host;
        	}

        	if(typeof port !== 'undefined'){
        		_port = port;
        	}

        	_headers += 'Message-ID: <4F452339.1040102@'+ _host +'>\r\n';
        	_headers += 'Date: ' + new Date().toUTCString() + '\r\n';
        	_headers += 'From: ' + sender + '\r\n';
        	_headers += 'MIME-Version: 1.0\r\n';
        	_headers += 'To: ' + receiver + '\r\n';
    	
    	}else{
    		throw this.INVALID_RECEIVER;
    	}
    };

	var end = function() {
		_fn(_evaluate);
	};

	var error = function(error) {
		_fn(_evaluate, error);
		_instance.end();
	};

	var timeout = function() {
		_fn(_evaluate, {code: 'ECONNTIMEOUT'});
		_instance.end();
	};

	var data = function (line) {
		
		line = line.toString().split('\r\n');

		for ( var l in line ){

			var matches;
			if (matches = line[l].match(/Spam: (True|False) ; (-?\d+\.\d) \/ (-?\d+\.\d)/)) {
				
				_evaluate.spam = matches[1] == 'True' ? true : false;
				_evaluate.evaluation = matches[2];
				_evaluate.allowed = matches[3];
				
			}
		}
	};

	var connected = function(){

		_instance.write("SYMBOLS SPAMC/1.3\r\n", function () {
			_instance.write("User: " + _receiver + "\r\n\r\n", function () {
				_instance.write("X-Envelope-From: " + _sender + "\r\n", function ()
				{
					_instance.write(_headers);
					_instance.end('\r\n');
				});
			});
		});
        	
    };

    Constructor.prototype = {
        
        constructor: Spamd,

        INVALID_RECEIVER: 'Invalid sender and receiver',
        NO_CALLBACK: 'Evaluate method requires a callback',

        evaluate: function(subject, body, fn){
        	
        	_headers += 'Subject: ' + subject + '\r\n';
        	_headers += 'Content-Type: text/plain; charset=UTF-8; format=flowed\r\n';
			_headers += 'Content-Transfer-Encoding: quoted-printable\r\n';
			_headers += '\r\n' + body;

        	if(typeof fn !== 'undefined'){
        		
        		_fn = fn;
    			_instance = net.connect(_port, _host, connected);

        		_instance.on('end', end);
				_instance.on('error', error);
				_instance.on('timeout', timeout);
				_instance.on('data', data);
        		
        	}else{
        		throw this.NO_CALLBACK;
        	}
						
        },
        
        reset: function(){
        	_evaluate = {};
			_fn = null;
        }
    };
    
    return Constructor;
    
}());

module.exports = Spamd;