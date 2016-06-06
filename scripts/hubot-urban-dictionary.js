// Description:
//   Hits UrbanDictionary API for slang definitions
//
// Commands:
//   hubot roulette set tries - sets total of number of tries before guaranteed failure
//   hubot roulette set command - sets the trigger word
//   hubot roulette set success - sets outcome on a successful try
//   hubot roulette set fail - sets outcome on a failed try
//   hubot roulette start - begins a game of roulette
//
// Notes:
//   Designed to match Russian Roulette. Tries is the capacity of the revolver (with one bullet),
//   a 'success' is defined as the gun NOT going off.

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
