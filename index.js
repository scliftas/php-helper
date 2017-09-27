
'use strict';

const Alexa = require('alexa-sdk');
const functions = require('./functions');

const APP_ID = 'amzn1.ask.skill.eaee0e89-d795-4f4f-a575-335def788075';

const languageStrings = {
  'en': {
    translation: {
      FUNCTIONS: functions.FUNCTIONS_EN,
      SKILL_NAME: 'PHP Helper',
      WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what is echo? ... Now, what can I help you with?",
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      DISPLAY_CARD_TITLE: '%s  - Description for %s.',
      HELP_MESSAGE: "You can ask questions such as, what is echo, or, you can say exit...Now, what can I help you with?",
      HELP_REPROMPT: "You can say things like, what is echo, or you can say exit...Now, what can I help you with?",
      STOP_MESSAGE: 'Goodbye!',
      FUNCTION_REPEAT_MESSAGE: 'Try saying repeat.',
      FUNCTION_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
      FUNCTION_NOT_FOUND_WITH_ITEM_NAME: 'the description for %s. ',
      FUNCTION_NOT_FOUND_WITHOUT_FUNCTION_NAME: 'that description. ',
      FUNCTION_NOT_FOUND_REPROMPT: 'What else can I help with?',
    },
  }
};

const handlers = {
  'LaunchRequest': function () {
    this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'LookupIntent': function () {
    const functionSlot = this.event.request.intent.slots.Function;
    let functionName;
    if (functionSlot && functionSlot.value) {
      functionName = functionSlot.value.toLowerCase();
    }
    
    const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), functionName);
    const myFunctions = this.t('FUNCTIONS');
    var functionV = myFunctions[functionName];
    
    if (functionV) {
      this.attributes.speechOutput = functionV;
      this.attributes.repromptSpeech = this.t('FUNCTION_REPEAT_MESSAGE');
      this.emit(':askWithCard', functionV, this.attributes.repromptSpeech, cardTitle, functionV);
    }
    else {
      let speechOutput = this.t('FUNCTION_NOT_FOUND_MESSAGE');
      const repromptSpeech = this.t('FUNCTION_NOT_FOUND_REPROMPT');
      if (functionName) {
        speechOutput += this.t('FUNCTION_NOT_FOUND_WITH_ITEM_NAME', functionName);
      } else {
        speechOutput += this.t('FUNCTION_NOT_FOUND_WITHOUT_ITEM_NAME');
      }
      speechOutput += repromptSpeech;
      
      this.attributes.speechOutput = speechOutput;
      this.attributes.repromptSpeech = repromptSpeech;
      
      this.emit(':ask', speechOutput, repromptSpeech);
    }
  },
  'AMAZON.HelpIntent': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE');
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.RepeatIntent': function () {
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'Unhandled': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE');
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
  },
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};