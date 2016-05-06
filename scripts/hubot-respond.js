// Description:
//   Allows users to set custom responses to phrases
//
// Commands:
//   hubot when <phrase> say <response> - Responds to <phrase> with <response> (regex allowed)
//   hubot when <phrase> shut up - Removes all responses associated with <phrase>
//
// Notes:
//   Regular expressions are allowed. If a response is already defined for a particular phrase
//   the new response is pushed into a set of responses, which hubot randomly chooses.
//
//   In the case that a message matches multiple phrases, hubot will respond with the first
//   matched response.
//


module.exports = function(robot) {
    var key = 'hubot-respond-responsemap';
    var responseMap;

    robot.respond(/when (.*) say (.*)/i, function(response) {
        var message = response.match[1];
        if (responseMap[message]) {
            responseMap[message].push(response.match[2]);
        } else {
            responseMap[message] = [response.match[2]];
        }
        robot.brain.set(key, responseMap);
    });

    robot.respond(/when (.*) shut up/i, function(response) {
        var message = response.match[1];
        delete responseMap[message];
        robot.brain.set(key, responseMap);
    });

    robot.respond(/respond clear/i, function(response) {
        responseMap = {};
        robot.brain.set(key, undefined);
    });

    robot.hear(/.*/, function(response) {
        var message = response.match[0];
        for (var regexstr in responseMap) {
            var regex = new RegExp(regexstr, 'im');
            var match = regex.exec(message);
            if (match) {
                response.send(response.random(responseMap[regexstr]));
                return
            }
        }
    });

    robot.brain.on('loaded', function() {
        responseMap = robot.brain.get(key) || {};
    });
};
