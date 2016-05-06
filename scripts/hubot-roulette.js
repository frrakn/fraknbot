// Description:
//   Plays Russian Roulette with configured phrase responses
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
    var key = 'hubot-roulette-default';
    var config;

    var currentConfig = {}
    var count;
    var active = false;

    robot.respond(/roulette set tries (\d+)/i, function(response) {
        var tries = parseInt(response.match[1]);
        if (isNaN(tries)) {
            response.send("You didn't even enter in a number...");
            response.send(config.fail);
        }
        config['tries'] = tries;
        robot.brain.set(key, config);
    });

    robot.respond(/roulette set command (.+)/i, function(response) {
        config['command'] = new RegExp(response.match[1], 'ig');
        robot.brain.set(key, config);
    });

    robot.respond(/roulette set success (.+)/i, function(response) {
        config['success'] = response.match[1];
        robot.brain.set(key, config);
    });

    robot.respond(/roulette set fail (.+)/i, function(response) {
        config['fail'] = response.match[1];
        robot.brain.set(key, config);
    });

    robot.respond(/roulette start/i, function(response) {
        currentConfig.tries = config.tries;
        currentConfig.command = config.command;
        currentConfig.success = config.success;
        currentConfig.fail = config.fail;
        count = 0;
        active = true;
    });

    robot.respond(/roulette show/i, function(response) {
        response.send("Tries: " + config.tries);
        response.send("Command: " + config.command);
        response.send("Success: " + config.success);
        response.send("Fail: " + config.fail);
    });

    robot.hear(/.*(?:\s+.*)*/, function(response) {
        if (active) {
            var match = config['command'].exec(response.match[0]);
            if (match) {
                var outcome = Math.floor(Math.random() * (currentConfig.tries - count));
                if (outcome < 1) {
                    response.send(currentConfig.fail);
                    active = false;
                } else {
                    response.send(currentConfig.success);
                    count++;
                }
            }
        }
    })

    robot.brain.on('loaded', function() {
        config = robot.brain.get(key) || {
            tries: 6,
            command: /tard me/ig,
            success: "...",
            fail: "TARD"
        };
    })
};
