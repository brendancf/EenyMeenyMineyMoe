/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = null;//"amzn1.ask.skill.6603d900-c66c-41e9-8435-e95954a07ee5";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

const eenyMeenyMineyMoe = require('./eenyMeenyMineyMoe');

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Eeny, meeny, miney, moe',
            HELP_MESSAGE: "Let fate decide who's turn it is, ask eeny meeny to decide!",
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

/**
 * EenyMeeny is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var EenyMeeny = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
EenyMeeny.prototype = Object.create(AlexaSkill.prototype);
EenyMeeny.prototype.constructor = EenyMeeny;
EenyMeeny.prototype.resources = languageStrings;

EenyMeeny.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("EenyMeeny onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

EenyMeeny.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("EenyMeeny onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to eeny meeny miney mo. You can say 'Who's turn is it John or Sarah'";
    var repromptText = "You can say 'Who's turn is it John or Sarah'";
    response.ask(speechOutput, repromptText);
};

EenyMeeny.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("EenyMeeny onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

EenyMeeny.prototype.intentHandlers = {
    // register custom intent handlers

    'GetNewFactIntent': function (intent, session, response) {
        chooseEntity(intent, session, response);
    },

    'ChooseName': function (intent, session, response) {
        chooseEntity(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        giveExample(intent, session, response);
    }
};

function giveExample(intent, sessions, response) {
    response.ask("You can say 'Who's turn is it John or Sarah'", "You can say 'Who's turn is it John or Sarah'");
}

function chooseEntity(intent, session, response) {
    var chosen = eenyMeenyMineyMoe.choose(intent);

    if (chosen == null){
        giveExample(intent, session, response);
    } else {
        // Create speech output
        var possessiveName = chosen;
        if (!possessiveName.endsWith('s')) {
            possessiveName += "'s";
        }

        const output = `It's ${possessiveName} turn`;
        response.tellWithCard(output, "Eeny, meeny, miney, moe", output);
    }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the EenyMeeny skill.
    var eenyMeeny = new EenyMeeny();
    eenyMeeny.execute(event, context);
};
