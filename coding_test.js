const axios = require('axios');

const url = 'https://wordle.votee.dev:8000/random';

// status of the result word
const absent = 'absent';
const present = 'present';
const correct = 'correct';

var allCharacters = []
/// this array will store the present word and the slot of the word
var presentSlotWord = []

// test()

// function test() {
//     const words = [
//         "Abide", "About", "Abuse", "Acute", "Admit", "Adopt", "Agree", "Alarm", "Align", "Allow",
//         "Alone", "Alter", "Amend", "Angle", "Apple", "Apply", "Arena", "Argue", "Array", "Arrow",
//         "Aside", "Asset", "Atone", "Awake", "Award", "Baked", "Basic", "Begin", "Belay", "Below",
//         "Blend", "Block", "Bloom", "Board", "Brain", "Break", "Brick", "Bring", "Broad", "Broke",
//         "Brown", "Brush", "Build", "Burst", "Carry", "Catch", "Cause", "Chain", "Chair", "Charm",
//         "Chart", "Chase", "Cheat", "Check", "Chest", "Chief", "Chill", "Chose", "Clear", "Climb",
//         "Close", "Cloud"
//     ];

//     for(let i = 0; i< words.length; i++) {
//         renewOriginalCharacters();
//         guessWord(words[i])
//     }
// }

main()

async function main() {
    renewOriginalCharacters();
    const result = await guessWord();
    console.log('final correct guess word ', result)
}

// Get all character from a-zA-Z
function renewOriginalCharacters() {
    const baseCharacters = Array.from({length: 26}, (v,i) => String.fromCharCode(i + 97));
    allCharacters.push(...baseCharacters);
    for(let i = 0; i < baseCharacters.length; i++) {
        allCharacters.push(baseCharacters[i].toUpperCase());
    }
    presentSlotWord = []
}

// validate guess word from the server
async function guessWord() {
    var hasFindWord = false
    const correctWords = [
        {slot: 0, guess: '', result: correct},
        {slot: 1, guess: '', result: correct},
        {slot: 2, guess: '', result: correct},
        {slot: 3, guess: '', result: correct},
        {slot: 4, guess: '', result: correct},
    ]
    var i = 0;
    while(!hasFindWord) {
        const newGuessWord = getRandomWordFromArray(correctWords)

        const guessWordResult = await compareWord(newGuessWord); 
        const correctInGuessWord = guessWordResult.filter(word => word.result === correct);
        if(correctInGuessWord.length == 5) {
            hasFindWord = true;
            console.log('looping in ', i)
            return correctInGuessWord;
        } else {
            if(correctInGuessWord.length > 0) {
                correctInGuessWord.forEach(word => {
                    correctWords[word.slot].guess = word.guess;
                })
            }
            const absentInGuessWord = guessWordResult.filter(word => word.result === absent);
            const presentInGuessWord = guessWordResult.filter(word => word.result === present);
            if(absentInGuessWord.length > 0) {
                removeAllAbsentWord(absentInGuessWord);
            }
            if(presentInGuessWord.length > 0) {
                presentInGuessWord.forEach(word => {
                    const index = presentSlotWord.findIndex((value, i, arr) => {
                        return value.guess == word.guess
                    })

                    if(index == -1) {
                        presentSlotWord.push({
                            slot: [word.slot],
                            guess: word.guess,
                        })
                    } else {
                        presentSlotWord[index].slot.push(word.slot)
                    }
                })
            }
        }
        i++;
    }

    return []
}

// get the word base on the correct word and present word
function getRandomWordFromArray(correctWords) {
    let word = ''
    for (let i = 0; i < 5; i++) {
        if(correctWords[i].guess != '') {
            word += correctWords[i].guess;
        } else {
            const presentForGuessWord = presentSlotWord.filter(word => !word.slot.includes(i));
            if(presentForGuessWord.length > 0) {
                word += presentForGuessWord[0].guess
            } else {
                word += allCharacters[Math.floor(Math.random() * allCharacters.length)];
            }
        }
    }
    return word;
}

// remove all absent word from the allCharacters array
function removeAllAbsentWord(absentWord) {
    absentWord.forEach(word => {
        allCharacters = allCharacters.filter(character => character != word.guess)
    })
}

// this function will compare the guess word with the sample result text
// This function also call API to get the result
async function compareWord(guess) {
    const response = await axios.get(url, {
        params: {
            guess: guess,
            seed: 1234
        }
    });
    return response.data;

    // below code is for local testing with certain text

    // const guessArray = guess.split('');
    // const originalArray = guessResult.split('');

    // const result = [];
    // for (let i = 0; i < guessArray.length; i++) {
    //     if (guessArray[i] === originalArray[i]) {
    //         result.push({
    //             slot: i,
    //             guess: guessArray[i],
    //             result: correct
    //         });
    //     } else if (originalArray.includes(guessArray[i])) {
    //         result.push({
    //             slot: i,
    //             guess: guessArray[i],
    //             result: present
    //         });
    //     } else {
    //         result.push({
    //             slot: i,
    //             guess: guessArray[i],
    //             result: absent
    //         });
    //     }
    // }

    // return result
}
