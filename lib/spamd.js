var net = require('net');
var uuid = require('node-uuid');

var Spamd = (function() {

    var INVALID_RECEIVER = 'Invalid sender and receiver';
    var NO_CALLBACK = 'Evaluate method requires a callback';
    var TIMEOUT = 'ECONNTIMEOUT';

    function Spamd(sender, receiver, host, port) {
        this.sender = sender;
        this.receiver = receiver;
        this.host = host;
        this.port = port;
    }

    Spamd.prototype.evaluate = function (subject, body, callback) {
        var self = this;
        var result = {};
        var headers = '';

        if (typeof callback !== 'undefined') {
            headers += 'Message-ID: <' + uuid.v4() + '@' + this.host + '>\r\n';
            headers += 'Date: ' + new Date().toUTCString() + '\r\n';
            headers += 'From: ' + this.sender + '\r\n';
            headers += 'MIME-Version: 1.0\r\n';
            headers += 'To: ' + this.receiver + '\r\n';
            headers += 'Subject: ' + subject + '\r\n';
            headers += 'Content-Type: text/plain; charset=UTF-8; format=flowed\r\n';
            headers += 'Content-Transfer-Encoding: quoted-printable\r\n';
            headers += '\r\n' + body;

            var instance = net.connect(this.port, this.host,
                function () {
                    connected(instance, headers, self.receiver, self.sender);
                });

            instance.on('end', function () {
                end(callback, result);
            });

            instance.on('error', function (err) {
                error(callback, result, err, instance);
            });

            instance.on('timeout', function () {
                timeout(callback, result, instance);
            });

            instance.on('data', function (line) {
                data(line, result);
            });
        } else {
            throw NO_CALLBACK;
        }
    };

    Spamd.prototype.reset = function () {
      // Deprecated
    };

    var connected = function (instance, headers, receiver, sender) {
        instance.write("SYMBOLS SPAMC/1.3\r\n", function () {
            instance.write("User: " + receiver + "\r\n\r\n", function () {
                instance.write("X-Envelope-From: " + sender + "\r\n", function () {
                    instance.write(headers);
                    instance.end('\r\n');
                });
            });
        });
    };

    var end = function (callback, result) {
        callback(result);
    };

    var error = function (callback, result, err, instance) {
        callback(result, err);
        instance.end();
    };

    var timeout = function (callback, result, instance) {
        callback(result, {code: TIMEOUT});
        instance.end();
    };

    var data = function (line, result) {
        line = line.toString().split('\r\n');

        for (var l in line) {
            var matches;
            if (matches = line[l].match(/Spam: (True|False) ; (-?\d+\.\d) \/ (-?\d+\.\d)/)) {

                result.spam = matches[1] == 'True' ? true : false;
                result.evaluation = matches[2];
                result.allowed = matches[3];

            } else if (line[l].indexOf(',') >= 0) {
                result.rules = line[l].split(',');
            }
        }
    };

    return Spamd;
})();

module.exports = Spamd;
