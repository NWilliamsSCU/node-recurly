(function() {
  'use strict';
  var https = require('https'),
      pjson = require('../package.json'),
      RecurlyError = require('./error'),
      Xml2js = require('xml2js'),
      parser = new Xml2js.Parser({
        explicitArray: false,
        explicitRoot: false,
        mergeAttrs: true,
        attrkey: '#',
        charkey: '#'
      });

  exports.create = function(config) {
    config.recurly_host = config.subdomain + '.recurly.com';
    return {

      request: function(route, data, callback) {
        if (typeof data == 'function') {
          callback = data;
          data = null;
        }
        var endpoint = route[0];
        var method = route[1];
        var self = this;
        var options = {
          host: config.recurly_host,
          port: 443,
          path: endpoint,
          method: method,
          headers: {
            Authorization: 'Basic ' + (new Buffer(config.apiKey)).toString('base64'),
            Accept: 'application/xml',
            'Content-Length': data ? data.length : 0,
            'User-Agent': 'node-recurly/' + pjson.version
          }
        };
        if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
          options.headers['Content-Type'] = 'application/xml';
          self.debug(data);
        }
        self.debug(options);
        var req = https.request(options, function(res) {
          var responseData = '';
          res.on('data', function(d) {
            responseData += d;
          });
          res.on('end', function() {
            responseData = self.trim(responseData);
            self.debug('Response Status Code: ' + res.statusCode);
            self.debug(responseData);
            try {
              if (res.statusCode >= 200 && res.statusCode <= 299) {
                if (responseData === '') {
                  return _returnBody(res);
                }
                return parser.parseString(responseData, function(err, result) {
                  if (err) {
                    return _returnBody(null, err);
                  }
                  return _returnBody(res, null, self.parse(result));
                });
              } else if ([404, 412, 422].indexOf(res.statusCode) !== -1) { // Client Request Error: Record Specific
                return parser.parseString(responseData, function(err, result) {
                  if (err) {
                    return _returnBody(null, err);
                  }
                  return _returnBody(res, self.parse(result));
                });
              } else if (res.statusCode >= 400) {
                return _returnBody(res, responseData);
              }
            } catch (e) {
              return _returnBody(null, e);
            }
          });
        });
        if (data) {
          req.write(data);
        }
        req.end();
        req.on('error', function(e) {
          return _returnBody(null, e);
        });
        function _returnBody(res, err, data) {
          if (typeof callback === 'undefined') {
            throw new Error('Missing argument: callback function');
          }
          if (typeof callback !== 'function') {
            throw new Error('Callback should be a function');
          }
          if (callback.length === 2) {
            if (err) {
              return callback(_wrapResponse(res, err));
            }
            return callback(null, _wrapResponse(res, data));
          } else if (callback.length === 1) {
            var toReturn = {
              status: 'ok',
              headers: res ? res.headers : null,
              body: ''
            };
            if (err) {
              toReturn.status = 'error';
              if (!res || err === Error || err instanceof Error) {
                toReturn.description = err;
              } else if (res.statusCode >= 400) {
                toReturn.body = res.statusCode;
                toReturn.additional = err;
              } else {
                toReturn.body = err;
              }
              return callback(toReturn);
            }
            toReturn.body = data;
            toReturn.description = res.statusCode;
            return callback(toReturn);
          }
        }
        function _wrapResponse(res, data) {
          if (!res) {
            return {
              body: data && data.stack ? data.stack : data
            };
          }
          return {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          };
        }
      },

      debug: function(s) {
        if (config.debug) {
          console.log(s);
        }
      },

      trim: function(str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
          if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
          }
        }
        return str;
      },

      parse: function parseTypes(input) {
        var result = {},
            mode = 'normal';
        try {
          for (var key in input) {
            if (!input.hasOwnProperty(key)) continue;
            var item = input[key];
            if (mode === 'array') {
              mode = 'normal';
              if (Array.isArray(item)) {
                result = [];
                for (var j = 0; j < item.length; j++) {
                  if (typeof item[j] == 'string') result.push(item[j]);
                  else result.push(parseTypes(item[j]));
                }
              } else {
                result = (typeof item === 'object' ? [parseTypes(item)] : [item]);
              }
            } else if (typeof item === 'object') {
              if (item['#'] && item.type && (item.type === 'datetime')) result[key] = new Date(item['#']);
              else if (item['#'] && item.type && (item.type === 'integer')) result[key] = parseInt(item['#'], 10);
              else if (item['#'] && item.type && (item.type === 'boolean')) result[key] = (item['#'] === 'true');
              else if (item['nil'] && item.nil && (item.nil === 'nil')) result[key] = '';
              else result[key] = parseTypes(item);
            } else if ((key === 'type') && (item === 'array')) mode = 'array';
            else result[key] = item;
          }
        } catch (e) {
          result = input;
        }
        return result;
      }

    };
  };

})();
