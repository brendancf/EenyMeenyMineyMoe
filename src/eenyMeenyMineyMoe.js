'use strict';

function choose(intent) {
    var peopleSlots = ['NameOne', 'NameTwo', 'NameThree', 'NameFour'];
    var people = [];

    for (var i=0; i < peopleSlots.length; ++i) {
        var nameSlot = intent.slots[peopleSlots[i]];
        if (nameSlot && nameSlot.value) {
            var name = nameSlot.value;

            console.log(name);

            if (name.endsWith("s")) {
                name = name.substr(0, name.length - 2);
            }

            people.push(name);
        }
    }

    if (people.length == 0) {
        giveExample(intent, session, response);
        return null;
    }

    const personIndex = Math.floor(Math.random() * people.length);
    const randomPerson = people[personIndex];

    return randomPerson
}

module.exports = {
    choose
};