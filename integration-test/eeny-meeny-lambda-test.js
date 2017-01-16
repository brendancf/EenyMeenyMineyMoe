'use strict';

const expect = require('chai').expect;
const AWS = require('aws-sdk');
const AWS_REGION = process.env.AWS_DEFAULT_REGION || 'us-east-1';
AWS.config.update({region: AWS_REGION});
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

var sampleResponse = {
    "version": "1.0",
    "response": {
        "outputSpeech": {
            "type": "PlainText",
            "text": "It's Teddy''s turn"
        },
        "card": {
            "content": "It's Teddy''s turn",
            "title": "Eeny, meeny, miney, moe",
            "type": "Simple"
        },
        "shouldEndSession": true
    },
    "sessionAttributes": {}
};

function callEenyMeenyLambda() {
    const params = {
        FunctionName: 'EenyMeenyMineyMoe'
    };

    params.Payload = JSON.stringify(
        {
            "type": "IntentRequest",
            "requestId": "EdwRequestId.e3140abd-9566-42d7-9868-f75a077ebb62",
            "locale": "en-US",
            "timestamp": "2017-01-16T17:41:13Z",
            "intent": {
                "name": "ChooseName",
                "slots": {
                    "NameOne": {
                        "name": "NameOne",
                        "value": "Sierra"
                    },
                    "NameFour": {
                        "name": "NameFour"
                    },
                    "NameTwo": {
                        "name": "NameTwo",
                        "value": "Teddy's"
                    },
                    "NameThree": {
                        "name": "NameThree"
                    }
                }
            }
        }
    );

    return lambda.invoke(params).promise();
}


describe('Eeny Meeny Miney Moe integration tests', () => {

    it('Returns Sierra or Teddy', done => {
        callEenyMeenyLambda()
                .then(data => {
                    expect(data.StatusCode).to.eql(200);
                    const payload = JSON.parse(data.Payload);
                    console.log(payload);
                    expect(payload.outputSpeech.text).to.contains("It's");
                    expect(payload.outputSpeech.text).to.contains("turn");
                    expect(payload.card.title).to.eql("Eeny, meeny, miney, moe");
                    done();
                })
                .catch(done);
    });


});