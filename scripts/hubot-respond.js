module.exports = function(robot) {
	var responseMap = robot.brain.get("hubot-respond-responsemap") || {};

	robot.respond(/when (.*) say (.*)/i, function(response) {
		var message = response.match[1];
		var reply = reply ? reply.push(response.match[2]) : [response.match[2]];
		responseMap[message] = reply;
		robot.brain.set("hubot-respond-responsemap", responseMap);
	});

	robot.respond(/when (.*) shut up/i, function(response) {
		var message = response.match[1];
		delete responseMap[message];
		robot.brain.set("hubot-respond-responsemap", responseMap);
	});

	robot.respond(/respond clear brain/i, function(response) {
		responseMap = {};
		robot.brain.set("hubot-respond-responsemap", undefined);
	});

	robot.hear(/.*/, function(response) {
		var message = response.match[0];
		for(var regexstr in responseMap) {
			var regex = new RegExp(regexstr, 'i');
			var match = regex.exec(message);
			if(match) {
				response.send(response.random(responseMap[regexstr]));
			}
		}
	});
};
