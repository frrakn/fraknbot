module.exports = function(robot) {
  var API_KEY = '235b55082e029b34';
  robot.respond(/get weather for (.*), (.*)/, function(response) {
    if (response.match && response.match.length == 3) {
      var city = response.match[1].replace(/\s+/g, '');
      var state = response.match[2].replace(/\s+/g, '');
      robot.http('http://api.wunderground.com')
        .header('accept', 'application/json')
        .path('api/' + API_KEY + '/conditions/q/' + state + '/' + city + '.json')
        .get()(function(err, res, body) {
          var weather = JSON.parse(body);
          if (err || !weather || (weather.response && weather.response.error)) {
            response.send('Can\'t find weather info for ' + city + ', ' + state + ' :(');
            return
          }
          var temperatureString = weather.current_observation.temperature_string;
          var weatherString = weather.current_observation.weather;
          var niceLocation = weather.current_observation.display_location.full;
          response.send('It is ' + temperatureString + ' and ' + weatherString + ' in ' + niceLocation);
        });
    }
  });
};
