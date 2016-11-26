'use strict';

var Alexa = require('alexa-sdk');
var SurfDataHelper = require('./surf_data_helper');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = 'You can tell Alexa to ask S.F. Surf Bot how are the waves at Mavericks or Ocean Beach or Pacifica.';
        this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'getSurfreport': function() {
      var itemSlot = this.event.request.intent.slots.Item;
      if (itemSlot && itemSlot.value) {
        var locationName = itemSlot.value.trim().toLowerCase();
      }

      if (_.isEmpty(locationName)) {
        this.attributes['speechOutput'] = 'Sorry, I didn\'t catch that.';
        this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
      });
      } else {
        var surfHelper = new SurfDataHelper();
        surfHelper.whichSpot(locationName).then(function(report) {
          this.emit(':tell', report);
        }).catch(function(err) {
          this.attributes['speechOutput'] = `I can\'t get a surf report for ${locationName || 'that spot'}`;
          this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
          this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
        });
      }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can tell Alexa to ask S.F. Surf Bot how are the waves at Mavericks or Ocean Beach or Pacifica.';
        this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Talk to you later');
    }
};
