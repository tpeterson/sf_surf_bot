'use strict';

const Alexa = require('alexa-sdk');
const SurfDataHelper = require('./surf_data_helper');

exports.handler = function(event, context, callback) {
  let alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

let handlers = {
  'LaunchRequest': function() {
    this.attributes['speechOutput'] = 'You can tell Alexa to ask Bay Area Surf Bot how are the waves at Mavericks or Ocean Beach or Pacifica.';
    this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
  },
  'getSurfreport': function() {
    let echo = this;

    if (echo.event.request.intent.name === 'getSurfreport' && echo.event.request.intent.slots.hasOwnProperty('SURFSPOT')) {
      let itemSlot = echo.event.request.intent.slots.SURFSPOT;
      let locationName = itemSlot.hasOwnProperty('value') ? itemSlot.value : false;

      if (!locationName) {
        echo.attributes['speechOutput'] = 'Sorry, I missed what you said.';
        echo.attributes['repromptSpeech'] = 'Where are you looking to surf?';
        echo.emit(':ask', echo.attributes['speechOutput'], echo.attributes['repromptSpeech']);
      } else {
        SurfDataHelper.whichSpot(locationName).then(function(report) {
          echo.emit(':tell', report);
        }).catch(function(err) {
          echo.attributes['speechOutput'] = `I can\'t get a surf report for ${locationName || 'that spot'}`;
          echo.attributes['repromptSpeech'] = 'Where are you looking to surf?';
          echo.emit(':ask', echo.attributes['speechOutput'], echo.attributes['repromptSpeech']);
        });
      }
    } else {
      echo.attributes['speechOutput'] = 'Sorry, I didn\'t catch that.';
      echo.attributes['repromptSpeech'] = 'Where are you looking to surf?';
      echo.emit(':ask', echo.attributes['speechOutput'], echo.attributes['repromptSpeech']);
    }
  },
  'AMAZON.HelpIntent': function() {
    this.attributes['speechOutput'] = 'You can tell Alexa to ask Bay Area Surf Bot how are the waves at Mavericks or Ocean Beach or Pacifica.';
    this.attributes['repromptSpeech'] = 'Where are you looking to surf?';
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
  },
  'AMAZON.StopIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function() {
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function() {
    this.emit(':tell', 'Talk to you later');
  }
};
