# Test Description

Write the program to automatically guess random word against the API with the following API "https://wordle.votee.dev:8000/random?guess=theft&seed=1234"

# Code language

Javascript 
Node (v18.20.0)

# Setup
You have to install the node js from the following website: https://nodejs.org/en
You can follow this website to setup the nodejs step by step in your computer: https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm

# Config source for running
Firstly, you have to run the command in your command line of this project: npm install
After it run successfully, you just run the following command to test my code: node coding_test.js and it will return for you the correct param and the number of repeat time to get this result.

# Brief description for my solution
I generate all character with lowercase and uppercase and store it into the arrays, and create a variable (presentSlotWord) for storing the present of word in the guess.

Every time I generate one random word, I check the correct word to insert it into the word and validate the present word for forecast the slot of this word in the guess. After that, I call API to validate the random word. If the response of this guess contains the character's absent result, I remove that character from the allCharacters and re-update the presentSlotWord and correctWords for further validating. And I looping this process until the response of API contains only the result of correct and return this result.
