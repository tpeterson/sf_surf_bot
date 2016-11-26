'use strict';
module.change_code = 1;

const _ = require('lodash');
const Alexa = require('alexa-app');
const app = new Alexa.app('sf_surfbot');
const SurfDataHelper = require('./surf_data_helper');

app.launch(function(req, res) {
  var prompt = 'Where are you looking to surf?';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// RESPOND TO STOP/CANCEL REQUEST
var exitFunction = function(request, response) {
  var speechOutput = 'Talk to you later';
  response.say(speechOutput);
};

app.intent('AMAZON.StopIntent', exitFunction);
app.intent('AMAZON.CancelIntent', exitFunction);

// RESPOND TO HELP REQUEST
app.intent('AMAZON.HelpIntent', function(request, response) {
    var speechOutput = 'I can report surf conditions for Mavericks, Ocean Beach and Pacifica. Where are you looking to surf?';
    response.say(speechOutput).shouldEndSession(false);
  });

app.intent('getSurfreport', {
    'slots': {
      'SURFSPOT': 'LIST_OF_LOCATIONS'
    },
    'utterances': ['{|what are|how are|how is|what is|how\'s|what\'s} {|the} {|waves|surf|conditions} {|for|at} {-|SURFSPOT}']
  },
  function(req, res) {
    // GET THE SLOT
    var locationName = req.slot('SURFSPOT');
    var reprompt = 'Tell me the name of a surf spot to get a surf report';

    if (_.isEmpty(locationName)) {
      var prompt = 'Can you say the surf spot again';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var surfHelper = new SurfDataHelper();
      surfHelper.whichSpot(locationName).then(function(report) {
        res.say(report).send();
      }).catch(function(err) {
        var prompt = `I can\'t get a surf report for ${locationName || 'that spot'}`;
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

module.exports = app;
