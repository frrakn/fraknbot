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
	var outcomes = [1,2,3,4,5,6];
	var tard = 6;

	robot.respond(/tardme/i, function(response) {
		var outcome = response.random(outcomes);
		if (outcome == tard) {
			response.send("You have the Downs.");
		} else {
			response.send("You are just dumb.");
		}
	});
};