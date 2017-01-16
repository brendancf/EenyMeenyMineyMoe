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
            "session": {
                "sessionId": "SessionId.7c9e7575-a992-4f9b-a894-7c40ed5687c0",
                "application": {
                    "applicationId": "amzn1.ask.skill.6603d900-c66c-41e9-8435-e95954a07ee5"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.ask.account.AF2HMM3N3XVFJ76RI52VPHCLEKTFIM5VGGVAR3M2WZIWZPHTRYVM3POXDNUPWT6BYHVVP4EASTUQ2NT6UB3JO6UAXSNBZXBQG2VYTVM2Y3SVQMYHQDNXCIEAAJFNO37UXUHG26IFLLQSBHFLPELZJPYV3GR6DGYUXW5EL3ZEVVRJLJAORQ36EQWX6DQU4QGJOYA2EGDTQK77YXI"
                },
                "new": true
            },
            "request": {
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
            },
            "version": "1.0"
        }

    );

    return lambda.invoke(params).promise();
}


describe('Eeny Meeny Miney Moe integration tests', () => {

    it('Is success', done => {
        callEenyMeenyLambda()
                .then(data => {
                    expect(data.StatusCode).to.eql(200);
                    const payload = JSON.parse(data.Payload);
                    //console.log(payload);
                    var response = payload.response;
                    expect(response.outputSpeech.ssml).to.contains("It's");
                    expect(response.outputSpeech.ssml).to.contains("turn");
                    expect(response.card.title).to.eql("Eeny, meeny, miney, moe");
                    done();
                })
                .catch(done);
    });


});