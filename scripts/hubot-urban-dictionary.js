// Description:
//   Hits UrbanDictionary API for slang definitions
//
// Commands:
//   hubot what is <query> - looks up <query> on urbandictionary
//

module.exports = function(robot) {
    var urbanDictionaryAddress = 'http://api.urbandictionary.com/v0/define?term=';

    robot.respond(/what is (.*)/i, function(response) {
        var word = encodeURIComponent(response.match[1]);
        robot.http(urbanDictionaryAddress + word)
            .header('Accept', 'application/json')
            .get()(function(err, res, body) {
                if (err) {
                    fail(response);
                }
                var data = JSON.parse(body);
                if (data && data['list'] && data['list'].length > 0) {
                    var entry = data['list'][0];
                    response.send('*Definition:* ' + entry['definition']);
                    response.send('*Example:* ' + entry['example']);
                    response.send(entry['permalink']);
                } else {
                    fail(response);
                }
            });
    });

    function fail(response) {
        response.send('Can\'t find it :(');
    }
};
