/**
 * App ID for the skill
 */
var APP_ID = null;//"amzn1.ask.skill.6603d900-c66c-41e9-8435-e95954a07ee5";

var Alexa = require('alexa-sdk');
const eenyMeenyMineyMoe = require('./eenyMeenyMineyMoe');

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Eeny, meeny, miney, moe',
            HELP_MESSAGE: "Let fate decide who's turn it is, ask eeny meeny to decide! You can say 'Who's turn is it John or Sarah'",
        },
    },
};

var handlers = {
    'LaunchRequest': function () {
        var speechOutput = this.t('HELP_MESSAGE');
        var repromptText = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, repromptText);
    },

    'ChooseName': function () {
        var chosen = eenyMeenyMineyMoe.choose(this.event.request.intent);

        if (chosen == null){
            this.emit(':ask', this.t('HELP_MESSAGE'));
        } else {
            // Create speech output
            var possessiveName = chosen;
            if (!possessiveName.endsWith('s')) {
                possessiveName += "'s";
            }

            const output = `Eeny meeny miney moe catch a tiger by the toe, if he hollars let him go eeny miney miney moe. It's ${possessiveName} turn`;
            this.emit(':tellWithCard', output, this.t('SKILL_NAME'), output);
        }
    },

    "AMAZON.HelpIntent": function () {
        this.emit(':ask', this.t('HELP_MESSAGE'));
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
