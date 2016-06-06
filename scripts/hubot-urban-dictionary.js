// Description:
//   Hits UrbanDictionary API for slang definitions
//
// Commands:
//   hubot what is <query> - returns urbandictionary definition on <query>
//   hubot use <query> in a sentence - returns urbandictionary's example on <query>
//   hubot urban me <query> - returns urbandictionary link to <query>
//

module.exports = function(robot) {
    var urbanDictionaryAddress = 'http://api.urbandictionary.com/v0/define?term=';

    robot.respond(/what is (.*)/i, function(response) {
        getEntry(response.match[1], function(entry) {
            if (entry) {
                var def = entry['definition'];
                if (def) {
                    response.send(def)
                } else {
                    fail(response)
                }
            } else {
                fail(response)
            }
        });
    });

    robot.respond(/use (.*) in a sentence/i, function(response) {
        getEntry(response.match[1], function(entry) {
            if (entry) {
                var ex = entry['example'];
                if (ex) {
                    response.send(ex)
                } else {
                    fail(response)
                }
            } else {
                fail(response)
            }
        });
    });

    robot.respond(/urban me (.*)/i, function(response) {
        getEntry(response.match[1], function(entry) {
            if (entry) {
                var urbanLink = entry['permalink'];
                if (urbanLink) {
                    response.send(urbanLink)
                } else {
                    fail(response)
                }
            } else {
                fail(response)
            }
        });
    });

    function getEntry(query, callback) {
        var word = encodeURIComponent(query);
        robot.http(urbanDictionaryAddress + word)
            .header('Accept', 'application/json')
            .get()(function(err, res, body) {
                if (err) {
                    callback(null);
                }
                var data = JSON.parse(body);
                if (data && data['list'] && data['list'].length > 0) {
                    var entry = data['list'][0];
                    callback(entry);
                } else {
                    callback(null);
                }
            });
    }

    function fail(response) {
        response.send('Can\'t find it :(');
    }
};
