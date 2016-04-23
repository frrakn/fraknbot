// Description:
//   Generates compliment sandwiches and allows users to customize compliments used for
//   sandwich
//
// Commands:
//   hubot compliment add <phrase> - adds <phrase> to pool of compliments
//   hubot compliment remove <phrase> - removes <phrase> from pool of compliments
//   hubot sandwich <phrase> - sandwiches <phrase> with two compliments
//
// Notes:
//   Yes, it's possible for the same compliment to be used twice in one sandwich. It's
//   a feature, not a flaw.

module.exports = function(robot) {
    var key = 'hubot-compliment-sandwich';
    var compliments;

    robot.respond(/compliment add (.*)/i, function(response) {
        updateCompliments();
        compliments.push(response.match[1]);
        robot.brain.set(key, compliments);
    });

    robot.respond(/compliment remove (.*)/i, function(response) {
        updateCompliments();
        var i = compliments.indexOf(response.match[1])
        if (i != -1) {
            compliments.splice(i, 1);
        }
        robot.brain.set(key, compliments);
    });

    robot.respond(/sandwich (.*)/i, function(response) {
        updateCompliments();
        response.send(response.random(compliments));
        response.send("".concat("But... ", response.match[1]));
        response.send("".concat(response.random(compliments), ", though."));
    });

    updateCompliments = function() {
        if (!compliments) {
            compliments = robot.brain.get(key) || ["You smell pretty nice"];
        }
    };
};
