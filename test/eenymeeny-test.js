'use strict';


const expect = require('chai').expect;

const eenyMeeny = require('../src/eenyMeenyMineyMoe');

const intent = {
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
        };

var context = {
    fail: () => {},
    succeed: () => {}
};

describe('Eeny Meeny unit tests', () => {

    it('Returns one of the names', () => {
        var names = ["Teddy", "Sierra"];
        var name = eenyMeeny.choose(intent);
        expect(names).to.include(name);
    });
});